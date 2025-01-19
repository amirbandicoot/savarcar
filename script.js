let carImages = ["aventador.jpg", "urus.jpg", "urus2.jpg", "aventador2.jpg", "artura.jpg", "artura2.jpg", "artura3.jpg", "720s.jpg", "aventador.jpg", "urus.jpg", "urus2.jpg", "aventador2.jpg"];
let carNames = ["Lamborghini Aventador", "Lamborghini Urus", "Lamborghini Urus SE", "Lamborghini Aventador SE", "McLaren Artura", "McLaren Artura SE", "McLaren Artura Type 3", "McLaren 720S", "Lamborghini Aventador", "Lamborghini Urus", "Lamborghini Urus SE", "Lamborghini Aventador SE"];
let carIndex = 0;
let isScrolling = false;
let activePage = 'main';
let theme = 1;
let startX; let endX;
function setupReel(e) {
    // Defining required vairables
    const type = e.type; const width = window.innerWidth;
    let max; 
    if(width <= 720) max = 1; else if(width <= 1700) max = 2; else max = 4;
    const boxes = document.getElementsByClassName('reel-container');
    // Creating the reel
    const create = () => {
        const reel = document.createElement('div');
        reel.className = 'reel';
        reel.id = 'cars-reel';
        reel.style.transition = '0.3s';
        return reel;
    }
    // Populating the reel
    const populate = (reel) => {
            reel.textContent = '';
            let index = (type == 'load') ? 0 : carIndex;
            for(let i = 0; i < max; i++) {
                const item = document.createElement('div');
                item.className = 'reel-item';
                const image = document.createElement('img');
                image.className = 'reel-image';
                image.style.borderColor = (theme == 1) ? '#444' : '#bbb';
                if(max == 1) {
                    image.style.width = width + 'px';
                    image.style.margin = '0px';
                } else {
                    image.style.width = (width / max) - 80 + 'px';
                    image.style.margin = '0px 30px';
                }
                image.loading = 'lazy';
                image.src = 'img/cars/' + carImages[index];
                
                image.addEventListener('touchstart', evt => {
                    startX = evt.changedTouches[0].screenX;
                })
                image.addEventListener('touchend', evt => {
                    endX = evt.changedTouches[0].screenX;
                    setupReel(evt);
                })
                const label = document.createElement('p');
                label.innerHTML = '#' + (index + 1) + ' ' + carNames[index++];
                label.style.color = (theme == 1) ? '#ccc' : '#555';
                item.appendChild(label);
                item.appendChild(image);
                if(i != max && i != 0) {
                    const divider = document.createElement('div');
                    divider.className = 'reel-divider';
                    if(theme == 1) divider.style.backgroundColor = '#3a3a3a'; else divider.style.backgroundColor = '#e6e6e6';
                    item.appendChild(divider);
                }
                reel.appendChild(item);
                boxes[0].style.height = (parseInt(image.style.width) / 1.777777777777778) + 2 + 'px';
            }
            
            boxes[0].appendChild(reel);
            // Creating pages
            (() => {
                const count = carImages.length / max;
                const box = document.getElementById('cars-indicator-container');
                const indicator = document.getElementById('cars-reel-indicator');
                box.style.width = count * 20 + 'px';
                setTimeout(() => {
                    indicator.style.left = (carIndex / max) * 20 + 'px';
                }, 1);
            })();
    }
    // Arranging the reel according to screen size
    const arrange = (reel) => {
        const re = carIndex % max;
        if(re != 0) carIndex -= re;
        // Detecting screen size changes
        if(max == 1 || reel.childNodes.length > max || reel.childNodes.length < max) {
            if(carIndex < max) carIndex = 0; else if(carIndex >= carImages.length - max) carIndex = carImages.length - max;
            populate(reel);
        }
    }
    // Scrolling the reel
    const scroll = (dir) => {
        isScrolling = true;
        const oReel = document.getElementById('cars-reel');
        const nReel = create();
        switch(dir) {
            case 'left': {
                if(carIndex > 0) {
                    nReel.style.left = - width + 'px';
                    nReel.style.opacity = '0.1';
                    carIndex -= max;
                    oReel.style.left = width + 'px';
                    oReel.style.opacity = '0.1';
                } else {
                    nReel.style.left = width + 'px';
                    nReel.style.opacity = '0.1';
                    carIndex = (carImages.length - max);
                    oReel.style.left = - width + 'px';
                    oReel.style.opacity = '0.1';
                }
                break; }
            case 'right': {
                if(carIndex < (carImages.length - max)) {
                    nReel.style.left = width + 'px';
                    nReel.style.opacity = '0.1';
                    carIndex += max;
                    oReel.style.left = - width + 'px';  
                    oReel.style.opacity = '0.1';
                } else {
                    nReel.style.left = - width + 'px';
                    nReel.style.opacity = '0.1';
                    carIndex = 0;
                    oReel.style.left = width + 'px';  
                    oReel.style.opacity = '0.1';
                }
                break; }
            default: {
                
                //alert(e.pageX - e.target.offsetLeft - e.target.children[0].offsetLeft);
                nReel.style.opacity = '0.1';
                if(e.pageX - e.target.offsetLeft < e.target.children[0].offsetLeft) {
                    nReel.style.left = width + 'px';
                    oReel.style.left = - width + 'px'; 
                } else {
                    nReel.style.left = - width + 'px';
                    oReel.style.left = width + 'px'; 
                }
                carIndex = parseInt((e.pageX - e.target.offsetLeft) / 20);
                oReel.style.opacity = '0.1';
                break; }
        }
        if(isScrolling) {
            populate(nReel);
            setTimeout(() => { nReel.style.left = '0px'; nReel.style.opacity = '1'; }, 10);
            setTimeout(() => { oReel.parentElement.removeChild(oReel); isScrolling = false; }, 300);
        }
        
    }
    // Processing according to event type
    switch(type) {
        case "load": {
            activePage = 'main';
            const page = document.getElementById('main-page');
            page.style.display = 'inline-block';
            setTimeout(() => { page.style.opacity = '1'; }, 1);
            populate(create());
            break; }
        case "resize": {
            const reel = document.getElementById('cars-reel');
            arrange(reel);
            break; }
        case "click": {
            if(!isScrolling) {
                const source = e.target.id; 
                if(source == 'left') {
                    scroll('left'); }
                else if(source == 'right') { scroll('right'); } else { scroll('jump'); }
            }
            break; }
        case 'touchend': {
            if(!isScrolling) {
                if(startX < endX) {
                    scroll('left');
                } else if(startX > endX) {
                    scroll('right');
                }
            }
            break; }
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu-bar');
    if(menu.style.display != 'inline-block') {
        menu.style.display = 'inline-block';
        setTimeout(() => { menu.style.left = '0px'; }, 1);
    } else {
        menu.style.left = "-300px";
        setTimeout(() => { menu.style.display = 'none'; }, 200);
    }
}

function toggleItem(e) {
    const parts = e.target.id.split('-');
    const arrow = document.getElementById(parts[0] + '-menu-arrow');
    const bot = document.getElementById(parts[0] + '-menu-item-bot');
    if(e.target.className == 'menu-item-top') {
        if(e.target.parentElement.offsetHeight == 55) {
            e.target.parentElement.style.height = (e.target.offsetHeight + bot.offsetHeight) + 'px';
            arrow.style.transform = 'rotate(-90deg)';
        } else {
            e.target.parentElement.style.height = '55px';
            arrow.style.transform = '';
        }
    }
}

function switchPage(e) {
    const name =  e.target.id.split('-')[0];
    const aPage = document.getElementById(activePage + '-page');
    aPage.style.opacity = '0';
    setTimeout(() => {
        aPage.style.display = 'none';
        activePage = name;
        const nPage = document.getElementById(name + '-page');
        nPage.style.display = 'inline-block';
        setTimeout(() => { nPage.style.opacity = '1'; }, 1);
    }, 300);
}



function toggleTheme() {
    // Setting theme
    theme = (theme == 1) ? 0 : 1;
    // Defining required shades
    const shades = [['#fff', '#fcfcfc', '#e6e6e6', '#bbb', '#777'], ['#222', '#2a2a2a', '#3a3a3a', '#444', '#ccc']];
    // Top Bar elements
    const logos = ['lightLogo.png', 'darkLogo.png'];
    const menus = ['lightMenu.png', 'darkMenu.png'];
    const topBar = document.getElementById('top-bar');
    const menuButton = document.getElementById('menu-button');
    const logo = document.getElementById('main-logo');
    // Footer elements
    const footer = document.getElementById('footer');
    // Menu Bar elements
    const menu = document.getElementById('menu-bar');
    const menuBotItems = document.getElementsByClassName('menu-item-bot');
    const menuSubItems = document.getElementsByClassName('menu-sub-item');
    // Reel elements
    const reelContainers = document.getElementsByClassName('reel-container');
    const reelDividers = document.getElementsByClassName('reel-divider');
    const reelImages = document.getElementsByClassName('reel-image');
    const reelIndicatorBoxes = document.getElementsByClassName('indicator-container');
    const reelIndicators = document.getElementsByClassName('reel-indicator');
    const texts = document.getElementsByTagName('p');
    // Applying theme on main elements
    document.body.style.backgroundColor = shades[theme][1];
    footer.style.backgroundColor = shades[theme][0];
    footer.style.borderColor = shades[theme][2];
    topBar.style.backgroundColor = shades[theme][0];
    topBar.style.borderColor = shades[theme][2];
    logo.src = 'img/ui/' + logos[theme];
    menuButton.src = 'img/ui/' + menus[theme];
    // Applying theme on menu elements
    menu.style.backgroundColor = shades[theme][0];
    menu.style.borderColor = shades[theme][2];
    for(let i = 0; i < menuBotItems.length; i++)
        menuBotItems[i].style.borderColor = shades[theme][2];
    for(let i = 0; i < menuSubItems.length; i++) {
        menuSubItems[i].style.backgroundColor = shades[theme][1];
        menuSubItems[i].style.borderColor = shades[theme][2];
    }
    // Applying theme on reel elements
    reelContainers[0].style.backgroundColor = shades[theme][0];
    reelContainers[0].style.borderColor = shades[theme][2];
    
    //reelIndicatorBoxes[0].style.transition = '0.2s';
    reelIndicatorBoxes[0].style.backgroundColor = shades[theme][0];
    reelIndicatorBoxes[0].style.borderColor = shades[theme][2];
    for(let i = 0; i < reelIndicators.length; i++) {
        //reelIndicators[i].style.transition = '0.2s';
        reelIndicators[i].style.backgroundColor = shades[theme][4];
        reelIndicators[i].style.borderColor = shades[theme][2];
    }
    for(let i = 0; i < reelDividers.length; i++) {
        reelDividers[i].style.backgroundColor = shades[theme][2];
    }
    for(let i = 0; i < reelImages.length; i++) {
        reelImages[i].style.borderColor = shades[theme][3];
    }
    for(let i = 0; i < texts.length; i++) {
        texts[i].style.color = shades[theme][4];
    }
}