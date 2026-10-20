---
title: CachyOS
date: 2025-08-21T00:00:00.000Z
lang: es
description: >-
  Mi viaje con CachyOS Linux durante las últimas tres semanas: problemas,
  soluciones y lecciones aprendidas
tags:
  - teknologi
  - personligt
translationOf: cachyos-journey
sourceHash: 7475e12b1bfde37427ff6c19e452ac5d3b01d64cb22515632cc1f4f20fa18266
aiTranslated: true
translationModel: gemini-3.1-flash-lite
translatedAt: '2026-10-20T18:09:05.003Z'
---
He estado usando CachyOS durante casi tres semanas. Empezó con problemas, y todavía no está completamente libre de ellos. Lucho casi a diario con Battle.net y todavía no hay una forma realmente buena de ejecutar GeForce Now. También tuve que instalar Windows para poder jugar a la beta de Battlefield 6 con un amigo.

Tomé dos decisiones al principio que resultaron ahorrarme bastantes problemas. Limine como gestor de arranque y btrfs como sistema de archivos. Ambas elecciones fueron un poco por intuición, pero la wiki de CachyOS recomendaba Limine, así que esa fue la elegida. No soy un usuario de Linux totalmente inexperto, pero he trabajado principalmente con servidores headless en mi armario o con un PC en el trabajo como equipo de pruebas. Tampoco pensé que necesitaría snapshots, pero al mismo tiempo, no pude encontrar nada realmente negativo sobre btrfs.

Ya en el primer intento de instalar CachyOS, fracasé. La instalación se interrumpió. Al final, busqué en su Discord y vi que una o dos personas más tenían el mismo problema y la recomendación fue "intentarlo un poco más tarde".

Claro, vale, quizás solo en el mundo de Linux sea una respuesta aceptable. Esperé al día siguiente y entonces no tuve problemas. Algo con el instalador de paquetes que no podía descargar ciertos archivos. En fin.

Viernes por la noche, he instalado CachyOS y estoy intentando montar mis discos y el servidor de mi armario. Aprendiendo un poco sobre fstab. Ejecuto una actualización del sistema.

Reinicio el ordenador. No arranca. Solo una pantalla negra. Genial. Me voy a dormir y pienso seriamente en volver a Windows. Sé que Arch requiere algo de intervención manual, pero no tengo ganas de que el ordenador se bloquee cada vez que lo reinicio.

Sábado. Me siento ante el ordenador como de costumbre. Me doy cuenta de que no funciona, y se siente un poco incómodo que mi rutina habitual de sentarme ante el ordenador esté rota. Un pequeño pensamiento sobre la dependencia flota en mi cabeza.

Sin embargo, veo que tengo snapshots para elegir cuando arranco. Selecciono una snapshot de antes de instalar y trastear con algunos programas. Arranca directamente. Averiguo cuál es la última snapshot que funciona y sigo con ella. Así que gracias a Limine y btrfs por salvarme ahí. Configuración cero por mi parte. Simplemente funcionó.

Una semana después, tengo motivos para agradecer de nuevo mi elección de Limine, ya que tengo que hacer dual boot y configurar secure boot para poner en marcha BF6. Con Limine fue muy sencillo, y gracias de nuevo a la wiki de CachyOS por la guía. Eso sí, hay que leer todo el texto antes de hacer nada. Los autores de la wiki quizás no sean las personas más pedagógicas del mundo. Si hubieras seguido la guía paso a paso, te habrías saltado la línea casi al final que dice "si tienes Limine, puedes saltarte casi todos estos pasos". Sí, gracias por eso y suerte que leí hasta ahí.

Pasó aproximadamente una semana y me encontré sentándome ante el ordenador y empezando a usarlo sin siquiera pensar que era Linux.

Sin embargo, en cuanto vas a jugar a WoW, te lo recuerdan. He tenido que usar tres aplicaciones diferentes para poder iniciar Battle.net. Primero Lutris, que dejó de funcionar, luego Bottles, que también dejó de funcionar después de un tiempo. Entonces encontré Faugust, que es el que uso ahora y hasta ahora no me ha fallado. WoW también funciona muy bien en CachyOS, así que eso está genial. Addons a través de WoWUP, que tiene un cliente súper rápido.

Pero supongo que esa es la espina en el costado, eso que hace que no se sienta al cien por cien. Cuando llegas a casa del trabajo y quieres jugar un poco, no quieres empezar a solucionar problemas o experimentar. Quieres ir directo al juego.

No me importa aprender cosas nuevas o estar probando cosas, pero a veces solo quieres que funcione. Así que, por ahora, habrá un dual boot con Windows. Pero por lo demás, se siente fantástico. Linux en el escritorio realmente ha avanzado mucho.

I'm using CachyOS, btw.

[![CachyOS Desktop](/assets/media/pics/cachyos-prntscrn.png)](/assets/media/pics/cachyos-prntscrn.png)
