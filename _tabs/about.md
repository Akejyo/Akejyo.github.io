---
# the default layout is 'page'
icon: fas fa-info-circle
order: 4
---

<style>
*, *:before, *:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
:root {
  --xlarge-size: 56px;
  --checkd-color: #04C93F;
  --box-shadow: 1px 3px 8px rgba(0, 0, 0, 0.2);
}
html, body {
  height: 100%;
  width: 100%;
}
body {
  color: #fff;
  background: radial-gradient(ellipse at bottom, #1C2837 0%, #050608 100%);
  background-attachment: fixed;
}
.avatar {
  border-radius: 50%;
  position: relative;
  box-shadow: 1px 3px 12px -4px var(--bg, rgba(255,255,255, 1));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--xlarge-size);
  height: var(--xlarge-size);
  font-size: var(--xlarge-size);
  margin: 5px;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
}
.avatar-link {
  display: inline-block;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.avatar img:hover {
  cursor: pointer;
}
.avatar:hover {
  transform: scale(1.2);
}

/* a, a:visited {
  text-decoration: none;
  color: white;
  opacity: 0.7;
}
a:hover, a:visited:hover {
  opacity: 1;
}
a.icon, a:visited.icon {
  margin-right: 2px;
  padding: 3px;
} */
.description {
  padding: 30px;
  position: absolute;
  top: 20%;
  width: 70%;
  z-index: 999;
}
.description p {
  font-size: 0.9em;
}
.description p + p {
  margin-top: 20px;
}
.description p.author {
  font-size: 0.7em;
}
.description p.author .fa-heart {
  color: #860014;
}
hr {
  margin: 26px 0;
  border: 0;
  border-top: 1px solid white;
  background: transparent;
  width: 25%;
  opacity: 0.1;
}
code {
  color: #ae94c0;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 0.9em;
}

</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
  const avatarImgs = document.querySelectorAll('.avatar img');
  avatarImgs.forEach(img => {
    img.addEventListener('click', () => {
      const href = img.parentElement.previousElementSibling.getAttribute('href');
      if (href) {
        window.open(href, '_blank');
      }
    });
  });
});
</script>

<div class="description">
  <hr />
  <p>
    Shitty code creater, this site is primarily used for archiving.
  </p>
  <p>
    I enjoy learning new things and I a font-end fun(see my <a href="https://akejyo.neocities.org/" target="_blank">neocite</a>).
  </p>
  <p>
    My favorite games are Arinights and ELDEN RING NIGHTREIGN.
  </p>
  <hr />
  <div>See my friends👇</div>
  <div class="row">
        <div class="avatar">
          <a class="avatar-link" href="https://zzzremake.github.io/site/">
            <img src="/img/zzzRemake.webp" alt="">
          </a>
        </div>
        <div class="avatar">
          <a class="avatar-link" href="https://www.cnblogs.com/IrisHyaline">
            <img src="/img/IrisHyaline.jpg" alt="">
          </a>
        </div>
        <div class="avatar">
          <a class="avatar-link" href="https://peahawf.github.io/">
            <img src="/img/peahawf.jpg" alt="">
          </a>
        </div>
        <div class="avatar">
          <a class="avatar-link" href="https://imomi263.github.io/">
            <img src="/img/imomi.jpg" alt="">
          </a>
        </div>
        <div class="avatar">
          <a class="avatar-link" href="https://be1happy.github.io/">
            <img src="/img/be1happy.png" alt="">
          </a>
        </div>
      </div>
</div>