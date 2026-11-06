
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
 

function parseImg(inner) {
  const m = inner.match(/"([^"]*)"\s*\{\s*(left|center|right)\s*\}/i);
  if (!m) return null;
  return { type: "img", src: m[1], align: m[2].toLowerCase() };
}
 
function parseDocument(text) {
  const titles = [];
  const titleRe = /<title>([\s\S]*?)<\/title>/g;
  let tm;
 
  while ((tm = titleRe.exec(text)) !== null) {
    const content = tm[1];
 
    const firstTag = content.search(/<(p|img)>/);
    const name = (firstTag === -1 ? content : content.slice(0, firstTag)).trim();
    const body = firstTag === -1 ? "" : content.slice(firstTag);
 
    const items = [];

    const partRe = /<p>([\s\S]*?)<\/p>|<img>([\s\S]*?)<\/img>/g;
    let pm;
 
    while ((pm = partRe.exec(body)) !== null) {
      if (pm[1] !== undefined) {

        const inner = pm[1];
        const parts = [];
        const imgRe = /<img>([\s\S]*?)<\/img>/g;
        let last = 0;
        let im;
        while ((im = imgRe.exec(inner)) !== null) {
          const before = inner.slice(last, im.index).trim();
          if (before) parts.push({ type: "text", text: before });
          const img = parseImg(im[1]);
          if (img) parts.push(img);
          last = imgRe.lastIndex;
        }
        const after = inner.slice(last).trim();
        if (after) parts.push({ type: "text", text: after });
        items.push({ type: "p", parts });
      } else {

        const img = parseImg(pm[2]);
        if (img) items.push(img);
      }
    }
 
    titles.push({ name, items });
  }
 
  return titles;
}
 

function imgHtml(img, inP) {
  let style;
  if (inP) {
    if (img.align === "center") {

      style = "display:block;margin:0 auto;";
    } else {
      const margin = img.align === "left" ? "margin:0 12px 8px 0;" : "margin:0 0 8px 12px;";
      style = `float:${img.align};${margin}`;
    }
  } else {
    const margins = {
      left: "margin-left:0;margin-right:auto;",
      center: "margin-left:auto;margin-right:auto;",
      right: "margin-left:auto;margin-right:0;",
    };
    style = `display:block;${margins[img.align]}`;
  }
  return `<img src="${escapeHtml(img.src)}" style="${style}">`;
}
 

function buildHtml(titles) {
  return titles
    .map((t, index) => {
      const inner = t.items
        .map((item) => {
          if (item.type === "img") return imgHtml(item, false);
          const content = item.parts
            .map((part) =>
              part.type === "img" ? imgHtml(part, true) : escapeHtml(part.text)
            )
            .join("\n");
          return `<p>${content}</p>`;
        })
        .join("\n");
 
      return (
        `<section data-id="${index}">\n` +
        `<h3 id="${escapeHtml(t.name)}">${escapeHtml(t.name)}</h3>\n` +
        `${inner}\n` +
        `</section>`
      );
    })
    .join("\n");
}
 

function renderToBody(text) {
  const container = document.querySelector(".body");
  if (!container) {
    console.error('Không tìm thấy phần tử có class "body".');
    return;
  }
  container.innerHTML = buildHtml(parseDocument(text));
}
 

async function loadAndRender(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Không tải được file: ${url}`);
  renderToBody(await res.text());
}

