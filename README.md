# WikiNews

WikiNews es un proyecto piloto de colaboración entre tres comunidades de tecnología de Madrid: AdaLab, Open Source Weekends y R-Ladies Madrid.

El objetivo de la aplicación es ver la relevancia de las noticias más importantes del New York Time en la Wikipedia.

## Las comunidades

En **AdaLab Digital** impulsan a mujeres jóvenes con dificultades de empleabilidad mediante un programa integral que incluye formación intensiva en perfiles del mundo web. [WebSite](http://adalab.es/)

**OS Weekends** se reúnen una vez al mes para crear un contribuir al código abierto. Se dan charlas, talleres y se organizan proyectos en los que todo el mundo es bienvenido, la única condición es que sea open source y sin ánimo de lucro. [WebSite](http://osweekends.com/)

**R-Ladies Madrid** es parte de una comunidad global que promueve la diversidad en los trabajos STEM y en concreto en el lenguaje de programación R. Actualmente se organiza en más de 60 ciudades en todo el mundo. [WebSite](http://rladies.org/)


## El proceso

Se recogen las noticias más relevates desde la [API del New York Times](https://developer.nytimes.com/), almacenando el título de la noticia, un resumen de la misma y sus etiquetas.

Se analiza el sentimiento de la noticia con la librería `syuzhet`.

Para ver la relevancia de la noticia en las visitas a la Wikipedia, se recogen las visitas de los tags de cada noticia mediante la [API de Wikipedia](https://www.mediawiki.org/wiki/API:Main_page).
