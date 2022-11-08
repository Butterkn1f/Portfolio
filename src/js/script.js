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
  let id = parseInt(urlParams.get('id') ?? "0");
  if (id > 13 || id < 1)
    id = 1;

    const nextButton = document.getElementById('nextProject');
    const prevButton = document.getElementById('prevProject');
    const videoPlayer = document.getElementById('video');
    const personCount = document.getElementById('personCount');
    const contentOverview = document.getElementsByClassName('content-overview')[0];
    const contentParagraph = document.getElementsByClassName('content-paragraph')[0];
    const madeIn = document.getElementById('madeIn');
    const language = document.getElementById('language');
    const sourceLink = document.getElementById('sourceLink');

    nextButton.addEventListener('click', () => {
    window.location.href=`workcontent.html?id=${id + 1}`
  })
  prevButton.addEventListener('click', () => {
    window.location.href=`workcontent.html?id=${id - 1}`
  })

    switch(id)
    {
      case 1:
        videoPlayer.src = "https://www.youtube.com/embed/GELyCEhkpvs?rel=0";
        prevButton.style.display = "none";
        break;
      case 2:
        videoPlayer.src = "https://www.youtube.com/embed/DvPKXcdUnf0?rel=0";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "Operation I<span>.</span>C<span>.</span>C<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "3D Game made in <strong>OpenGL</strong> for Studio Project."
        personCount.innerHTML = "Team of 4";
        madeIn.innerHTML = "February 2022"
        contentParagraph.innerHTML = "<p>The theme we were given for the project was <strong>Scam</strong>. Our team decided to make an FPS detective game to catch the scammers.</p><p>I was in charge of making the <strong>cutscenes, sound, interactions, environment,</strong> and <strong>lighting</strong>.</p><p>The greatest challenge I faced while making this game was figuring out how to do the <strong>interactions</strong>. Essentially, I want items to be highlighted when the middle of the camera is pointing at the object in a 3D space.</p><p>In the end, I figured it out by making use of <strong>raycasting</strong>. I projected a 3D ray from the mouse. The mouse position is in 2D coordinates, so I then transform the coordinates by working backwards through the <strong>3D transformation pipeline</strong> - from Viewport Coordinates to World Coordinates. After getting the coordinates, I check whether this invisible ray intersects with objects in my scene by using <strong>Oriented Bounding Box (OBB) Collision Detection</strong>.</p><p>Then, the objects are then highlighted using modifications to the OpenGL <strong>shader</strong>, and when the user clicks, it will fire the <strong>scripted events</strong> depending on the object clicked - such as moving a picture frame, opening a drawer, or opening a book.</p>"
        break;
      case 3:
        videoPlayer.src = "https://www.youtube.com/embed/XO67GGOji9A?rel=0";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "Maze Runner<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "2D Game made in <strong>OpenGL</strong> for Studio Project."
        personCount.innerHTML = "Team of 4";
        madeIn.innerHTML = "September 2022"
        contentParagraph.innerHTML = "<p>The theme we were given for the project was <strong>Survive</strong>. Our team decided to make a Horror Survival game where you have to <strong>collect all pieces of paper</strong> to unlock a door to escape, while surviving from <strong>monsters</strong> that lurk around the maze. You are also given a <strong>flashlight</strong> to allow you to see your surroundings and <strong>stun</strong> the monsters. However, your flashlight has a <strong>battery</strong>, and it would continue to <strong>flash more frequently</strong> the lower your battery is - each time it flashes you will be left in the <strong>complete dark</strong>.</p><p>I was in charge of making the <strong>flashlight</strong> and its <strong>projected rays</strong>, the <strong>battery mechanic</strong>, and the <strong>environment lighting</strong> and <strong>camera moving with player</strong>.</p><p>I <strong>refactored my Raycasting code</strong> from Operation I.C.C. to a 2D space to make the flashlight projection. However, since originally the rays are invisible, I had to figure out how to <strong>dynamically draw the rays</strong> that spread out from the flashlight such that the player knows that the flashlight is being controlled by the mouse position.</p><p>This is done through <strong>Mathematics</strong> calculation. Essentially, imagine a <strong>semicircle</strong> around the player, the center-most point on the circle's circumference would be the <strong>mouse position</strong>. <strong>Radius</strong> of the circle would then be the distance from the <strong>mouse position to the player's position</strong>, the coordinates would then be <strong>dynamically calculated</strong> by plotting points around the circumference of the semicircle.</p><p>The environment lighting is also dependent on the flashlight and the <strong>distance</strong> the rays intersect with each tile - the <strong>closer</strong> the rays are to the object, the <strong>brighter</strong> the tile would be. The changing in shading is done through modifications to a OpenGL Shader."
        break;
      case 4:
        videoPlayer.src = "https://www.youtube.com/embed/KVCgAZGyfRQ?rel=0";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "Spot's Adventure<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "3D Game made in <strong>OpenGL</strong> for Computer Graphics Module."
        personCount.innerHTML = "Solo";
        madeIn.innerHTML = "February 2022"
        contentParagraph.innerHTML = "<p>This project was part of our module to introduce us to <strong>Computer Graphics and OpenGL</strong>. In it, I took the model I made from my first assignment, and made it into a first person controller.</p><p>In this game, you will interact with the robots and play <strong>2 minigames</strong> to obtain all the gears needed to build a rocketship to Earth.</p><p>The first minigame is <strong>Dance Dance Revolution</strong>, where the player has to step on the tiles in time with the screen to score points. The floor lights up each time the player steps on a button.</p><p>The next minigame is an <strong>Atari-like shooting game</strong> where the player is given a laser gun and has to shoot at the enemies. The camera switches to a top-down view during this minigame.</p>"
        break;
      case 5:
        videoPlayer.src = "https://www.youtube.com/embed/WWPdhrGk8x4?rel=0";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "Spot<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "3D Model made in <strong>OpenGL</strong> for Computer Graphics Module."
        personCount.innerHTML = "Solo";
        madeIn.innerHTML = "December 2021"
        contentParagraph.innerHTML = "<p>This project was my first introduction to OpenGL.</p><p>I made <strong>Spot</strong> - a real robot made by Boston Dynamics, inside OpenGL. This model was made through <strong>hierarchical modelling</strong>, where the joints are properly set up to facilitate movement.</p><p>There are 3 different animations bundled with the model, along with an idle animation - a moonwalk animation, a dance animation, and a walking and opening door animation.</p>"
        break;
      case 6:
        videoPlayer.src = "https://www.youtube.com/embed/Gq1rKBWCH6Y?rel=0";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "Hollow Knight Remake<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "2D Game made in <strong>OpenGL</strong> for 2D Game Creation Module."
        personCount.innerHTML = "Solo";
        madeIn.innerHTML = "August 2022"
        contentParagraph.innerHTML = "<p>I tried to remake a simplified version of a popular game <strong>Hollow Knight</strong> inside OpenGL. The controls and gameplay are <strong>one-to-one</strong> with the original Hollow Knight series. The player is able to attack, jump, and absorb souls to heal.</p><p>There are a total of <strong>two</strong> separate enemies, and one <strong>boss battle</strong>. Each enemy defeated would fill up a <strong>Soul Gauge</strong> that the player can use to heal. The first enemy is just a normal <strong>Crawlid</strong> with no special moves, each attack by the player would cause it to get <strong>knocked back</strong>. The next enemy is a <strong>Husk Warrior</strong>. It can <strong>attack</strong> with its sword when the player is near. It was a <strong>shield</strong>, which it would use to <strong>block</strong> the player when attacked, and take <strong>no damage</strong>. However, each time it uses its shield, it is <strong>unable to move</strong>, so the player can take this chance to <strong>attack from behind</strong> to damage it.</p><p>The final boss battle is the <strong>False Knight</strong>. Upon entering its arena, gates will close behind you - trapping you with the Knight until he is defeated. The False Knight will try to <strong>jump on the player</strong>, and each time the player's attacks hit him, his <strong>armour</strong> will deteriorate. When his armour is completely broken, he will <strong>lie vulnerable on the floor</strong> for a couple seconds, for the player to actually damage it. Each attack in his vulnerable state will also drop <strong>soul</strong>, so the player can also heal while the boss is down.</p>"
        break;
      case 7:
        videoPlayer.src = "https://www.youtube.com/embed/4OHFvnm_pZQ?rel=0";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "Jungle Adventure<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "2D Game made in <strong>OpenGL</strong> for 2D Game Creation Module."
        personCount.innerHTML = "Solo";
        madeIn.innerHTML = "June 2022"
        contentParagraph.innerHTML = "<p>This was the first 2D game I made. I managed to figure out how to modify the original framework we were given to allow the <strong>camera to follow the player</strong>. The aim of the game is <strong>collect all the gems</strong> to spawn a key to <strong>unlock a door</strong> to get to the next level or win the game.</p><p>The player can attack to <strong>break obstacles</strong> like the crates. If the player clings onto a wall, he will start <strong>sliding down</strong> slowly, and this refills his jump and he can <strong>walljump</strong>. There is also <strong>timed platforms</strong> like the clouds that disappear after a couple seconds.</p><p>In the second level, there are boxes that drop new <strong>powerups</strong> for the player to use. One powerup is a <strong>double jump</strong>, and another powerup is <strong>dash</strong>.</p>"
        break;
      case 8:
        videoPlayer.src = "https://www.youtube.com/embed/kM5k127W8Rk?rel=0";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "Physics Bounce<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "2D Game made in <strong>OpenGL</strong> for Physics Module."
        personCount.innerHTML = "Solo";
        madeIn.innerHTML = "August 2022"
        contentParagraph.innerHTML = "<p>This is a <strong>Physics-based arcade game</strong> where the goal is to obtain as high a score as possible by staying alive. The player has a healthbar that <strong>depletes rapidly</strong> when it is stationary, and <strong>clicking and dragging</strong> on the screen would <strong>launch</strong> the player in the opposite direction. While aiming, time is <strong>slowed down</strong> and the gravity will pull the player down slower. The player has to collide with <strong>green balls</strong> to refill its <strong>health</strong>, and the balls also have a chance of dropping <strong>powerups</strong>.</p><p>The green balls are <strong>procedurally generated</strong> - despawning when they go out of the game's screen - and more are spawned each time another one is destroyed. Additionally, there is a formula that ensures that the green balls <strong>do not overlap</strong>, and there is also a <strong>dropoff</strong> to lessen the amount of green balls the higher up the player is.</p><p>There are also additional obstacles - like a <strong>blackhole</strong> that sucks the player in and immediately depletes all the player's health, and a <strong>satellite</strong> which spins constantly and would propel the player if hit.</p><p>There are 2 possible powerups in total. The first is a <strong>rocket buddy</strong> which will shoot at nearby green balls and replenish the health of the player. The second is <strong>Easy Mode</strong>, which gives the player 5 consecutive jumps instead of 3, increased slowmo, and the health depletes slower.</p>"
        break;
      case 9:
        videoPlayer.src = "https://streamable.com/e/6i0z5h";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "Spirit Snipers<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "Designing an interactive mobile UI in <strong>Unity</strong> for User Interface Module."
        personCount.innerHTML = "Team of 2";
        madeIn.innerHTML = "February 2022";
        language.innerHTML = "C# / Unity";
        contentParagraph.innerHTML = "<p>The focus of this assignment was on good Mobile <strong>User Interface Design</strong>, and it was also my first introduction to <strong>Unity</strong>.</p><p>I was in charge of making the main <strong>lobby, the Battle, Inventory, Bar, and Gacha</strong> screens. My teammate was in charge of making the main menu and in-game movable map.</p><p>On my own, I figured out how to do <strong>animations</strong> for the character, as well as change the animations based on whether it is attacking.</p><p>I made most of the assets by using <strong>Photoshop</strong> and obtaining various sprites from other <strong>games and anime</strong>.</p>";
        break;
      case 10:
        videoPlayer.src = "https://www.youtube.com/embed/n6-8ZGLRJbI?rel=0";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "Personal Site<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "Website made using <strong>pure CSS and HTML</strong> for Web Development Module."
        personCount.innerHTML = "Solo";
        madeIn.innerHTML = "May 2022"
        language.innerHTML = "HTML / Visual Studio Code";
        sourceLink.innerHTML = "<a href='https://butterkn1f.github.io/Personal/index.html' target='__blank'>Live Website Link</a>"
        contentParagraph.innerHTML = "<p>This was the first <strong>personal website</strong> I made. Due to assignment restrictions, we were not allowed to use Javascript, so everything was made using <strong>pure CSS and HTML</strong>.</p><p>I am most satisfied with the <strong>parallax effect</strong> I created without using Javascript in the <strong>About Me</strong> page. It was done through drawing an <strong>invisible 3x3 grid</strong>, and assigning variables that <strong>transform</strong> and rotates the entire content according to which grid the mouse is <strong>hovering over</strong>. I also separated the content into <strong>foreground</strong> and <strong>background</strong> and translated them at different perspectives to give them an added <strong>depth effect</strong>.</p><p>There is also a card flip effect that I was also happy with - upon hovering the various anime covers, it will flip and display the various statistics on the anime.</p><p>You can view the live website on the link to the left!</p>"
        break;
      case 11:
        videoPlayer.src = "https://www.youtube.com/embed/sCDDu0kRNyY?rel=0";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "VTuber Site<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "Website made using <strong>pure CSS, HTML and JS</strong> for Web Development Module."
        personCount.innerHTML = "Solo";
        madeIn.innerHTML = "August 2022"
        language.innerHTML = "HTML / Visual Studio Code";
        sourceLink.innerHTML = "<a href='https://butterkn1f.github.io/VTubers/index.html' target='__blank'>Live Website Link</a>"
        contentParagraph.innerHTML = "<p>This was the second personal website I created for this module. I decided to make my website to be based on <strong>Virtual YouTubers</strong>, which is a topic I am really passionate about. The website is also <strong>responsive</strong> on mobile and tablet viewports, as seen in the video.</p><p>The 'VIRTUAL' text is purely animated using CSS animations, and so are the other button glitch effects. In the landing page, there is an <strong>infinitely scrolling carousell</strong>.</p><p>There is also a database page, which makes use of a psuedo-database created inside a <strong>Javascript object</strong>, as databases were not allowed within the scope of the environment. The search function searches through and filters through the Javascript object that I defined.</p>"
        break;
      case 12:
        videoPlayer.src = "https://www.youtube.com/embed/VF6GMHIkldw?rel=0";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "Video To ASCII<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "Software made using <strong>Python and output using Windows Console</strong> in free time."
        personCount.innerHTML = "Solo";
        madeIn.innerHTML = "April 2021"
        language.innerHTML = "Python / Anaconda";
        contentParagraph.innerHTML = "<p>In preparation for my first day of school, I created a converter that converts any inputted <strong>video to ASCII</strong> in the Windows Console. This was done in <strong>Python</strong>.</p><p>At first, I extracted out <strong>each frame</strong> of the video into pictures in a folder. Then, I converted each frames to <strong>grayscale</strong>. After which, I converted each of the frames to ASCII text depending on the <strong>values</strong> of each pixel, using a predefined set of unicode characters.</p><p>The Windows Console then continuously prints the text generated, with the original video's sound playing.</p>"
        break;
      case 13:
        nextButton.style.display = "none";
        videoPlayer.src = "https://www.youtube.com/embed/VTapUxohpA4?rel=0";
        contentOverview.getElementsByTagName('h2')[0].innerHTML = "Gamification Design<span>.</span>";
        contentOverview.getElementsByTagName('p')[0].innerHTML = "Interactive UIs made using <strong>Invision Studio</strong> for Gamification Module."
        personCount.innerHTML = "Team of 4";
        madeIn.innerHTML = "August 2022"
        language.innerHTML = "Invision Studio";
        contentParagraph.innerHTML = "<p>Here is a collection of <strong>mobile user interfaces</strong> I have designed for my Gamification module. Unfortunately, I have lost the original file for the 2nd project, so the video only shares static screenshots of the UI. Although both projects are done in a team of 4, we split it such that <strong>2 of us designs the UI</strong>, while the other 2 would work on doing research.</p><p>The first project is a <strong>fitness</strong> app. I designed the <strong>Home and Coach screens</strong>, while my teammate did Assessments and Profile.</p><p>The second project is a minigame meant to teach players <strong>how to read a topological map</strong>. I designed the <strong>Main Menu, Profile, and Leaderboard screens</strong>, while my teammate designed all the game screens and map.</p>"
        break;
      default:
        break;
    }
}