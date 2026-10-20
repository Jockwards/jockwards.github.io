class LiteYouTube extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") {
      return;
    }

    const videoId = this.getAttribute("videoid");
    if (!videoId) {
      return;
    }

    this.dataset.ready = "true";
    const title = this.getAttribute("title") || "YouTube-video";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "lite-youtube-button";
    button.setAttribute("aria-label", `Spela upp: ${title}`);

    const thumbnail = document.createElement("img");
    thumbnail.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    thumbnail.alt = "";
    thumbnail.loading = "lazy";
    thumbnail.decoding = "async";
    thumbnail.width = 480;
    thumbnail.height = 360;

    const play = document.createElement("span");
    play.className = "lite-youtube-play";
    play.setAttribute("aria-hidden", "true");
    play.textContent = "▶";

    button.append(thumbnail, play);
    this.replaceChildren(button);

    button.addEventListener(
      "click",
      () => {
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        iframe.title = title;
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.loading = "lazy";
        this.replaceChildren(iframe);
      },
      { once: true },
    );
  }
}

if (!customElements.get("lite-youtube")) {
  customElements.define("lite-youtube", LiteYouTube);
}
