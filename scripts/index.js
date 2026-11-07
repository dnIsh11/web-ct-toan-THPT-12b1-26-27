const topbutton = document.getElementById('topbox');

if(!topbutton.innerHTML){
    topbutton.insertAdjacentHTML('afterbegin',`
            <a href='/index.html'>
                <button class='topbutton'>Trang chủ</button>
            </a>
            <a href='/pages/l10.html'>
                <button class='topbutton'>Lớp 10</button>
            </a>
            <a href='/pages/l11.html'>
                <button class='topbutton'>Lớp 11</button>
            </a>
            <a href='/pages/l12.html'>
                <button class='topbutton'>Lớp 12</button>
            </a>`
    );
}

const linkbox = document.getElementById('linkbox');
const linkboxHtml = `
<nav class='linkcontainer'>
    <div class='header-linkbox-buttons'>
        <button class='selectbutton selectbutton-onActive-true' id='daiso'>Đại số</button>
        <button class='selectbutton selectbutton-onActive-false' id='hinhhoc'>Hình học</button>
    </div>
        <ul class='container-show-true' id='ldaiso'></ul>
        <ul class='container-show-false' id='lhinhhoc'></ul>
</nav>
`;
linkbox.innerHTML = linkboxHtml;
