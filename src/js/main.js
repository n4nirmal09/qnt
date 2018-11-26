import "./utilities/smooth-scroll" 

(function($) {

  "use strict";

  var S, Qobj = {
    _init() {
      S = Qobj.settings
      this.resizeListener()


      this.scrollDierectionChecker()
      this.scrollBarWidth()
      this.menuClick()
      this.mainBanner()
      this.gallerySlider()
      this.testimonial()
      this.events()
      if ($('#main-loader').length) {
        this.mainLoaderAnimation()
      }

    },

    settings: {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      scrollClassTrigger: 0,
      scrollBarWidth: 0
    },

    // Debounce function to optimize event listeners. we dont want it fire every time.
    debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this,
          args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      }
    },

    // Resize Function
    resizeFunctions() {
      S.windowWidth = window.innerWidth
      S.windowHeight = window.innerHeight
      // console.log(S.windowHeight)
    },

    // ResizeListener 
    resizeListener() {
      let resize = this.debounce(this.resizeFunctions, 250)
      window.addEventListener('resize', resize)
    },

    
    //Update scroll bar width
    scrollBarWidth() {
      var outer = document.createElement("div");
      outer.style.visibility = "hidden";
      outer.style.width = "100px";
      outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

      document.body.appendChild(outer);

      var widthNoScroll = outer.offsetWidth;
      // force scrollbars
      outer.style.overflow = "scroll";

      // add innerdiv
      var inner = document.createElement("div");
      inner.style.width = "100%";
      outer.appendChild(inner);

      var widthWithScroll = inner.offsetWidth;

      // remove divs
      outer.parentNode.removeChild(outer);

      S.scrollBarWidth = widthNoScroll - widthWithScroll;


    },
    // Main menu toggler
    menuClick() {
      $(".mobile-toggle-button").on("click", function() {
        $(this).toggleClass("act-menu")
        $("body").toggleClass("show-menu")
      })
    },


    // FUNCTIONS
    mainBanner() {
      $('.main-banner .slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
      })
    },

    gallerySlider() {
      $('.gallery .slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        // asNavFor: '.slider-for',
        // dots: true,
        arrows: false,
        centerMode: true,
        focusOnSelect: true,
        responsive: [{
          breakpoint: 1025,
          settings: {
            initialSlide: 0,
            centerMode: true,
            centerPadding: '20%',
            slidesToShow: 1
          }
        }]
      })
    },

    events() {
      $('.events-slides .slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        // asNavFor: '.slider-for',
        // dots: true,
        arrows: false,
        // centerMode: true,
        focusOnSelect: true,
        responsive: [{
          breakpoint: 1025,
          settings: {
            initialSlide: 0,
            centerMode: true,
            centerPadding: '20%',
            slidesToShow: 1
          }
        }]
      })
    },

    testimonial() {
      $('.testimonials .slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
      })
    },

    // main loader animation
    mainLoaderAnimation() {
      let mainLoader = $('#main-loader'),
        tl = new TimelineMax({
          delay: 0.2,
          onStart() {
            $('body').addClass('no-scroll')
            TweenLite.set($('#main-wrapper main,#main-wrapper #main-header,#main-loader'), {paddingRight: S.scrollBarWidth})

          },
          onComplete() {
            
            TweenLite.set($('#main-wrapper main,#main-wrapper #main-header,#main-loader'), {paddingRight: 0})
            $('body').removeClass('no-scroll')
          }
        })

      TweenLite.set(mainLoader, { autoAlpha: 1 })
      TweenLite.set(mainLoader.find('.hor-box'), { scaleX: 0.2 })
      TweenLite.set(mainLoader.find('.ver-box'), { scaleY: 0.2 })

      tl.to(mainLoader.find('.hor-box'), 1, { scaleY: 0.2, ease: Power2.easeInOut })
        .to(mainLoader.find('.ver-box'), 1, { scaleX: 0.6, ease: Power2.easeInOut }, 0.4)
        .to(mainLoader.find('.hor-box'), 1, { scale: 0.98, ease: Power2.easeInOut }, 0.6)
        .to(mainLoader.find('.ver-box'), 1, { scale: 0.98, ease: Power2.easeInOut }, 0.6)
        .from(mainLoader.find('.logo-holder'), 1, { autoAlpha: 0, scale: 0.5, ease: Power2.easeInOut }, 0.8)
        .to(mainLoader.find('.hor-box'), 1, { scaleY: 0, ease: Power2.easeInOut }, 2)
        .to(mainLoader.find('.ver-box'), 1, { scaleX: 0, ease: Power2.easeInOut }, 2)
        //.to(mainLoader.find('.logo-holder'), 1, { autoAlpha: 0, ease: Power2.easeInOut }, 2)
        .to(mainLoader, 0.5, { scale: 1.5, autoAlpha: 0, display: 'none', ease: Power2.easeInOut },'ending-seq')
        .to($('#main-wrapper main,#main-wrapper #main-header,#main-wrapper #main-footer'), 0.5, { scale: 1, autoAlpha: 1, ease: Power2.easeInOut},'ending-seq+=0.3')
      
      
    },

    // Scrollchecker
    // Adding scroll class
    scrollDierectionChecker() {

      function scrollCheck() {
        if (window.scrollY > S.scrollClassTrigger) {
          document.querySelector('body').classList.add('scrolled');
        } else {
          document.querySelector('body').classList.remove('scrolled');
        }
      }

      function scrollDirCheck(e) {
        var delta = ((e.deltaY || -e.wheelDelta || e.detail) >> 10) || 1;;
        if (delta > 0) {

          document.querySelector('body').classList.remove('scrolling-up');
          document.querySelector('body').classList.add('scrolling-down');
        } else {
          document.querySelector('body').classList.remove('scrolling-down');
          document.querySelector('body').classList.add('scrolling-up');
        }
      }

      window.onscroll = function() { scrollCheck() };
      window.addEventListener('mousewheel', scrollDirCheck);
      window.addEventListener('DOMMouseScroll', scrollDirCheck);

    },

  }

  Qobj._init()

})(jQuery)
