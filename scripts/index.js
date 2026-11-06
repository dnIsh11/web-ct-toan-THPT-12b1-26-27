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
    console.log("aa")
}
