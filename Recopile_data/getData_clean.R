# Obtenemos principales noticias de NYT
library(httr)
library(RMySQL)


## Activar y validar Args
args <- commandArgs(TRUE)

if (length(args) == 0) {
  stop("At least one argument must be supplied (NYT - API TOKEN)", call. = FALSE)
}

# Indicar API key!
api_key <- args[1]

# Accediendo a los tags de noticias Convertimos el json en dataframe a procesar
getDataDromNews <- function(kk) {
  info <- character(0)
  info <- append(info, kk$published_date)
  info <- append(info, kk$title)
  info <- append(info, kk$abstract)
  info <- append(info, kk$url)
  info <- append(info, kk$adx_keywords)
  info
}

k1 <- lapply(content(sample2)$results, FUN = getDataDromNews)
data = as.data.frame(t(as.data.frame(k1)))
rownames(data) <- NULL
colnames(data) <- c("fecha", "titulo", "abstract", "url", "tags")
data <- data.frame(lapply(data, as.character), stringsAsFactors = FALSE)

# Nos conectamos a la bbdd
mydb = dbConnect(MySQL(), user = "root", password = "root", host = "127.0.0.1")


getInfotag <- function(tag, fecha) {
  ## Revisamos el tema de las comas
  tam <- unlist(strsplit(tag, ","))
  #Comprobamos las comas!
  res <- ifelse(length(tam) > 1, paste0(gsub("+", "", tam[2]), tam[1]), tam)
  res_tag <- GET(paste0("https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageviews&titles=", res))
  noticia_impacto <- 0  #= no tiene impacto en visitas, 1 si que las tiene
  ressult <- NULL
  if (names(content(res_tag)$query$pages) == "-1") {
    print("no hay entradas en wikipedia")
  } else {
    result <- unlist(content(res_tag))[5:64]
    result[is.na(result)] <- 0
    ressult <- as.numeric(result)
    ressult[is.na(ressult)] <- 0
    noticia_impacto <- 1
  }
  paste(ressult, collapse = ",")
}


insertTag <- function(valor, id_not) {
  query <- dbSendQuery(mydb,
                       paste0("insert into tags (id_noticia, visitas)  values ('",
                              id_not, "', '", valor, "');"))
}


getTagNoticia <- function(midata) {
  lista_tags <- midata[5]
  fecha <- midata[1]
  no2 <- gsub(")", " ", as.character(lista_tags))
  no2 <- gsub("\\(", " ", no2)
  no2 <- gsub(" ", "+", no2)
  tags <- unlist(strsplit(no2, ";"))
  query <- dbSendQuery(mydb,
                       paste0("insert into articulo (fecha, titulo, texto_noticia, url)  values ('",
                              fecha, "', '", midata[2], "','",
                              midata[3], "','", midata[4], "');"))
  # Nos quedamos con el id
  query <- dbSendQuery(mydb, "SELECT id_noticia FROM articulo ORDER BY id_noticia DESC LIMIT 1;")
  id_not <- fetch(query, n = 10)
  res_tags <- unlist(lapply(tags, FUN = getInfotag, fecha = fecha))
  sapply(res_tags, FUN = insertTag, id_not = id_not)
  res_tags
}

re<-apply(data,1,FUN=getTagNoticia)
