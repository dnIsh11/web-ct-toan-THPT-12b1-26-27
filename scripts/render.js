function escapeHtml(str) {
    if(str===undefined) return "";
    return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseImg(inner){
    const m = inner.match(/"([^"]*)"\s*\{\s*(left|center|right)\s*\}\s*&n([^\r\n]*)/i);
    return {type:"img",src:m[1],align:m[2],name:m[3].trim()};
}

function parseDocument(text) {
    const PartRe = /@part\s*([^\r\n]*)([\s\S]*?)@\/part/g;
    const SectRe = /@section\s*([^\r\n]*)([\s\S]*?)@\/section/g;
    const ItemRe = /{p}([\s\S]*?)&e|{img}([^\r\n]*)/g;

    const Doc = [];

    let tm;
    while ((tm = PartRe.exec(text)) !== null){
        const content = tm[2];
        const part = [];
        let sm;
        while ((sm = SectRe.exec(content)) !== null){
            const scontent = sm[2]
            const sec = [];
            let im;
            while ((im = ItemRe.exec(scontent)) !== null){
                if (im[1] !== undefined) sec.push({type:"text",data:im[1]});
                if (im[2] !== undefined) sec.push(parseImg(im[2]));
            }
            part.push({name:sm[1].trim(),data:sec})
        }
        Doc.push({name:tm[1].trim(),data:part});
    }
    return Doc;
}

function imgHtml(img){
    let style;

    if (img.align === "center"){
        style = `display:block`
    } else{
        style = `float:${img.align}`
    }
    return `
    <figure class="figImg">
        <img src="${escapeHtml(img.src)}" style="${style}">
        <figcaption> ${escapeHtml(img.name)} </figcaption>
    </figure>`;
}

function buildHtml(Doc){
    if (!Array.isArray(Doc)) return ""; 
    return Doc
    .map((part, index) => {
        const inner = part.data
        .map((sec,index2) => {
            const innersec = sec.data
            .map(item => {
                if(item.type === "text") return `<p>${item.data}</p>`;
                if(item.type === "img") return imgHtml(item);
                return "";
            }).join("\n");
            return `
            <section class="subSection" data-subsection-id="${index2}">
                <div class="subSectionHead">
                    <span>
                        <h3 id="${sec.name}"> ${sec.name} </h3>
                    </span>
                </div>
                ${innersec}
            </section>`;
        }).join("\n");
        return `
        <section class="Section" data-section-id="${index}">
            <div class="sectionHead">
                <span>
                    <h2 id="${part.name}"> ${part.name} </h2>
                </span>
            <div>
            ${inner}
        </section>`
    }).join("\n");
}

function renderToBody(text, id) {
    const container = document.querySelector(id);
    if (!container) {
    console.error('Không tìm thấy phần chứa');
    return;
    }
    container.innerHTML = buildHtml(parseDocument(text));
}

async function loadAndRender(url,id) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Không tải được file: ${url}`);
    renderToBody(await res.text(),id);
}