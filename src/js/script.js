import Scrollbar from "smooth-scrollbar";
import { gsap, Power1 } from "gsap";
import { ModalPlugin } from "./plugins/scroll-disable";
import { DATA } from "./data";

// Prevent mobile from scrolling
window.addEventListener("scroll", preventMotion, false);
window.addEventListener("touchmove", preventMotion, false);

function preventMotion(event)
{
    window.scrollTo(0, 0);
    event.preventDefault();
    event.stopPropagation();
}

// Mobile navbar
let hamburger = document.querySelector(".hamburger-button");
let mobileNav = document.getElementById("navigation");
hamburger.addEventListener('click', () => mobileNav.classList.toggle("active"))

if (document.URL.includes("index.html"))
{
    // Parallax effect
    let container = document.querySelector('.left-container');
    let containerSub = document.querySelector('.left-container > div');

    container.addEventListener('mousemove', (e) => transformCard(e, container, containerSub));
    container.addEventListener('mouseenter', () => handleMouseEnter(containerSub));
    container.addEventListener('mouseleave', () => handleMouseLeave(containerSub));
}
function transformCard(mouseEvent, card, cardSub) {
  let mouseX, mouseY;
  mouseX = mouseEvent.pageX;
  mouseY = mouseEvent.pageY;

  const centerX = card.offsetLeft + card.clientWidth / 2;
  let centerY = card.offsetTop  + card.clientHeight / 2;
  if (window.innerWidth <= 720)
    centerY =  card.clientHeight / 2;
  
  const percentX = (mouseX - centerX) / (card.clientWidth / 2);
  const percentY = -((mouseY - centerY) / (card.clientHeight / 2));

  cardSub.style.transform = "perspective(400px) rotateY(" + percentX * 5 + "deg) rotateX(" + percentY * 5 + "deg)";
}

function handleMouseEnter(cardSub) {
  setTimeout(() => {
    cardSub.style.transition = "";
  }, 100);
  cardSub.style.transition = "transform 0.3s";
}

function handleMouseLeave(cardSub) {
  cardSub.style.transition = "transform 0.3s";
  setTimeout(() => {
    cardSub.style.transition = "";
  }, 100);

  //reset transform
  cardSub.style.transform = "perspective(400px) rotateY(0deg) rotateX(0deg)";
}

if (document.URL.includes("work.html"))
{
  const constants = {
  SIZES: {
    MENU: {
      X: 5,
      Y: 40,
    },
  },
};

window.addEventListener("load", () => {
  const content = document.querySelector(".content");
  const scrollBar = document.querySelector(".scrollbar");
  const navContainer = [].slice.call(document.querySelectorAll(".nav > li"));
  const scrollMenu = document.querySelector(".scroll-menu");
  const side = document.querySelector(".side");

  Scrollbar.use(ModalPlugin);
  const verticalScrollbar = Scrollbar.init(content, {
    damping: 0.05,
    delegateTo: document,
  });
  verticalScrollbar.setPosition(0, 0);
  verticalScrollbar.track.yAxis.element.remove();
  verticalScrollbar.track.xAxis.element.remove();
  verticalScrollbar.updatePluginOptions("modal", { open: true });
  verticalScrollbar.addListener(({ offset }) => {
    const { clientHeight, scrollHeight } = verticalScrollbar.containerEl;
    const progress = Number.parseInt(
      ((offset.y / (scrollHeight - clientHeight)) * 360).toFixed(0),
      10
    );
    const rotatePercentage = ((progress * (333 - 225)) / 360 + 225).toFixed(0);

    gsap.to(scrollBar, {
      transform: `rotate(${rotatePercentage}deg)`,
    });
  });

  const initMenu = () => {
    const { X, Y } = constants.SIZES.MENU;

    gsap.to(scrollMenu, {
      delay: 0.8,
      autoAlpha: 1,
      ease: Power1.easeOut,
    });
    navContainer.forEach((navItem, index) => {
      const tl = gsap.timeline();

      tl.to(navItem, {
        transform: `translate( -${X * index}px, ${Y * index}px)`,
        duration: 0,
      })
        .to(navItem, {
          stagger: 0.2,
          delay: 0.8,
          autoAlpha: 1,
          ease: Power1.easeOut,
        })
        .then(() =>
          verticalScrollbar.updatePluginOptions("modal", { open: false })
        );

      navItem.addEventListener("click", () => {
        const scrollContent = [].slice.call(
          document.querySelector(".scroll-content").querySelectorAll(".item")
        );

        const scrollItem = scrollContent.find(
          ({ dataset }) => dataset.id === navItem.dataset.id
        );

        onMenuSelect(navItem);
        verticalScrollbar.scrollIntoView(scrollItem, {
          onlyScrollIfNeeded: true,
        });
      });
    });

    onMenuSelect(navContainer[0]);
  };

  const onMenuSelect = (selectedItem) => {
    const { X, Y } = constants.SIZES.MENU;
    toggleActive(selectedItem);

    for (const [i, navItem] of navContainer.entries()) {
      const id = Number.parseInt(selectedItem.dataset.id, 10);
      const index = i + 1;

      const currentItemYPos = gsap.getProperty(navItem, "translateY");
      const selectedItemYPos = gsap.getProperty(selectedItem, "translateY");

      const translateSteps = selectedItemYPos / Y;
      const translateValue = translateSteps * Y;

      gsap.to(navItem, {
        transform: `translate(
          ${index < id ? -(X * (id - index)) : X * (id - index)}px, 
          ${currentItemYPos - translateValue}px
        )`,
        duration: 0.8,
        ease: Power1.easeOut,
      });
    }
  };

  const toggleActive = (item) => {
    navContainer.forEach((n) => {
      if (n.dataset.id === item.dataset.id) {
        item.classList.add("active");
      } else {
        n.classList.remove("active");
      }
    });
  };

  const generateList = () => {
    const scrollContent = document.querySelector(".scroll-content");

    DATA.forEach((item) => scrollContent.appendChild(createItem(item)));

    scrollContent.classList.add(DATA.length % 2 === 0 ? "even" : "odd");

    if (scrollContent.children.length === DATA.length) {
      gsap.to(scrollContent, {
        autoAlpha: 1,
        delay: 1,
      });
    }
  };

  const createItem = (item) => {
    const itemContainer = document.createElement("div");
    const heading = document.createElement("div");
    const title = document.createElement("div");
    const order = document.createElement("span");
    const picture = document.createElement("div");

    itemContainer.classList.add("item");
    itemContainer.addEventListener('click', () => {
      window.location.href=`workcontent.html?id=${item.id}`
    })
    heading.classList.add("heading");
    title.classList.add("title");
    order.classList.add("order");
    picture.classList.add("picture");

    if (item.imgUrl) {
      const img = document.createElement("img");
      img.src = item.imgUrl;
      picture.appendChild(img);
    }

    title.textContent = item.title;
    order.textContent = item.id;

    heading.appendChild(title);
    heading.appendChild(order);
    itemContainer.appendChild(heading);
    itemContainer.appendChild(picture);

    if (item.hasOwnProperty("navId")) {
      itemContainer.setAttribute("data-id", item.navId);
    }

    return itemContainer;
  };

  const animateList = () => {
    gsap.to(side.children, {
      stagger: 0.15,
      delay: 1,
      y: 0,
      autoAlpha: 1,
    });
  };

  initMenu();
  generateList();
  animateList();

  let options = {
    root: verticalScrollbar.containerEl,
    rootMargin: "0px",
    threshold: 0.5,
  };

  let observer = new IntersectionObserver((entries, _) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const selection = navContainer.find(
          ({ dataset }) => dataset.id === entry.target.dataset.id
        );

        if (Boolean(selection)) {
          onMenuSelect(selection);
        }
      }
    });
  }, options);

  verticalScrollbar.containerEl.querySelectorAll(".item").forEach((p) => {
    observer.observe(p);
  });
});
}

if (document.URL.includes("workcontent.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get('id');
  if (id > 13 || id < 1)
    id = 1;
}