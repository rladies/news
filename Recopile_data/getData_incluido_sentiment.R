library(httr)
library(RMySQL)
library(purrr)
library(stringr)
library(syuzhet)

## Validate args, get API KEY as first argument
args <- commandArgs(TRUE)

if (length(args) == 0) {
  stop("At least one argument must be supplied (NYT - API TOKEN)", call. = FALSE)
}

api_key <- args[1]

# Get 20 most viewed news and keep date, title, abstract, url, tags
twenty_news <- GET(paste0("https://api.nytimes.com/svc/mostpopular/v2/mostviewed/World/1.json?api-key=", api_key))
news <- as.data.frame(content(twenty_news)$results %>%
    map_df(magrittr::extract,
           c("published_date", "title", "abstract", "url", "adx_keywords")))


# Connect to DB
mydb <- dbConnect(MySQL(), user = "root", password = "root", host = "127.0.0.1")
query <- dbSendQuery(mydb, "USE noticias;")
dbSendQuery(mydb, "TRUNCATE TABLE articulo")
dbSendQuery(mydb, "TRUNCATE TABLE tags")

getInfotag <- function(tag) {

  # Petition to get visits on the tag
  wiki_tags <- GET(paste0("https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageviews&titles=", tag))
  cat(paste(content(wiki_tags), '\n'))

  result <- unlist(content(wiki_tags))[5:64]
  visits <- as.numeric(result)
  visits[is.na(visits)] <- 0

  dev <- c(tag,paste(visits, collapse = ","))
  dev
}


insertTag <- function(tag, id_news) {
  query <- dbSendQuery(mydb,
                       paste0("INSERT INTO tags (id_noticia, visitas, name_tag) VALUES ('",
                              id_news, "', '", tag[2], "','",tag[1],"');"))
}


getTagNoticia <- function(line) {
  tags <- line[5] %>%
    str_split(";") %>%
    map(str_extract, boundary("word")) %>%
    flatten() %>%
    map(paste0, collapse="+") %>%
    unlist

  sentiment <- get_sentiment(gsub("[.]","",line[3]), method = "syuzhet")
  scale_sent <- line[3] %>%
    str_extract_all(boundary("word")) %>%
    unlist() %>%
    get_sentiment() %>%
    rescale() %>%
    mean
  scale_sent <- ifelse(is.nan(scale_sent), 0, scale_sent)

  query <- dbSendQuery(mydb,
                       paste0("INSERT INTO articulo (fecha, titulo, texto_noticia, url, sentiment_value, name_tag_scale) VALUES ('",
                              line[1], "', '", line[2], "','", line[3], "','",
                              line[4], "','",sentiment,"','",scale_sent,"');"))

  # Get news ID
  id_news <- dbGetQuery(mydb, "SELECT id_noticia FROM articulo ORDER BY id_noticia DESC LIMIT 1;")

  tags_impact <- tags %>%
    map(getInfotag)

  tags_impact %>% map(insertTag, id_news = id_news)

}

apply(news, 1, getTagNoticia)

dbDisconnect(mydb)
