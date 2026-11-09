function escapeHtml(str) {
    if(str===undefined) return "";
    return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function udlcase(str){
    return str.replaceAll(" ","_");
}

//Xử lý Document
function parseImg(inner){
    const m = inner.match(/"([^"]*)"\s*\{\s*(left|center|right)\s*\}\s*&n([^\r\n]*)/i);
    if (m === null) {console.error("ảnh không hợp lệ"); return ""}
    return {type:"img",src:m[1],align:m[2],name:m[3].trim()};
}

function parseParts(text,lv){
    if (text === undefined) return "";
    const Regex = new RegExp(`@lv${lv}\\s*([^\\r\\n]*)([\\s\\S]*?)@/lv${lv}|{p}([\\s\\S]*?)&e|{img}([^\\r\\n]*)`,'g');
    const content = text;
    const list = [];
    let im;
    while ((im = Regex.exec(content)) !== null){
        if (im[1] !== undefined){
            list.push({type:"section",level:lv,name:im[1],data:parseParts(im[2],lv+1)});
        } else {
            if (im[3] !== undefined) list.push({type:"text",data:im[3]});
            if (im[4] !== undefined) list.push(parseImg(im[4]));
        }        
    }
    return list;
}

function parseDocument(text) {
    return parseParts(text,1);
}


// tạo mã html
function imgHtml(img){
    let style;

    if (img.align === "center"){
        style = `display:block`
    } else{
        style = `float:${img.align}`
    }
    return (
    `<figure class="figImg">
        <img src="${escapeHtml(img.src)}" style="${style}" onerror="this.onerror=null; this.src='/assets/emergency-image-on-failedLoading.jpg';">
        <figcaption> ${escapeHtml(img.name)} </figcaption>
    </figure>`);
}

function buildHtml(Doc){
    if (!Array.isArray(Doc)) return "";
    return Doc
    .map((part,index) => {
        if (part.type === "section"){
            return (
                `<section data-local-section-id="${index}">
                    <div class="heading-section heading-section-${part.level}">
                        <h${part.level} id="${udlcase(part.name)}">${part.name}</h${part.level}>
                    </div>
                    ${buildHtml(part.data)}
                </section>`
            );
        } else {
            if(part.type === "text") return `<p>${part.data}</p>`;
            if(part.type === "img") return imgHtml(part);
            return "";
        }
    }).join("\n");
}

function buildTOCbox(Doc){
    if (!Array.isArray(Doc)) return "";
    return Doc
    .map((part,index) => {
        if (part.type === "section"){
            return (
                `<li id="toc-${udlcase(part.name)}" class="vector-toc-list-item vector-toc-list-level-${part.level}">
                    <a class="vector-toc-link" href="#${udlcase(part.name)}">
                        <div class="vector-toc-text">
                            <span>${part.name}</span>
                        </div>
                    </a>
                    <ul id="toc-${udlcase(part.name)}-sublist" class="vector-toc-list">${buildTOCbox(part.data)}</ul>
                </li>`
            );
        }
        return ""
    }).join("\n");
}


//hàm khởi tạo
function renderToBody(text, id, sidebox_id) {
    const container = document.querySelector(id);
    if (!container) {
        console.error('Không tìm thấy phần chứa nội dung');
        return;
    }
    const parsed_Document = parseDocument(text);
    container.innerHTML = buildHtml(parsed_Document);
    
    if (sidebox_id!==''){
        if (!container) {
            console.error('Không tìm thấy phần chứa thanh điều hướng');
            return;
        }
        const sideContainer = document.querySelector(sidebox_id);
        sideContainer.innerHTML = buildTOCbox(parsed_Document);
    }
}

async function loadAndRender(url,content_body_id,content_vector_box_id='') {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Không tải được file: ${url}`);
    renderToBody(await res.text(),content_body_id,content_vector_box_id);
}