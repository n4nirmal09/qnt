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
      this.lazyload()
      this.parallaxBg()
      if ($('#main-loader').length) {
        this.mainLoaderAnimation()
      } else {
        this.detectAnimation()
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
      $(".mobile-toggle-button").on("click", this.toggleMainMenu)
    },

    // Toggle main menu
    toggleMainMenu() {
      $(".mobile-toggle-button").toggleClass("act-menu")
      $("body").toggleClass("show-menu")
    },


    // Sliders
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
            TweenLite.set($('#main-wrapper main,#main-wrapper #main-header,#main-loader'), { paddingRight: S.scrollBarWidth })

          },
          onComplete() {

            TweenLite.set($('#main-wrapper main,#main-wrapper #main-header,#main-loader'), { paddingRight: 0 })
            $('body').removeClass('no-scroll')
            Qobj.detectAnimation()
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
        .to(mainLoader, 0.5, { autoAlpha: 0, display: 'none', ease: Power2.easeInOut }, 'ending-seq')
        .to($('#main-wrapper main,#main-wrapper #main-header,#main-wrapper #main-footer'), 0.5, { autoAlpha: 1, ease: Power2.easeInOut }, 'ending-seq+=0.3')


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

    // Lazyloading images
    lazyload: function() {
      var controller = new ScrollMagic.Controller(),
        mobBreak = 1024;

      var processFigure = function(figure) {

        var src = $(figure).data('src'),
          mobSrc = $(figure).data('mob-src'),
          loadingSrc = "";

        if (mobSrc) {
          if (s.windowWidth < mobBreak) {
            loadingSrc = mobSrc
          } else {
            loadingSrc = src
          }
        } else {
          loadingSrc = src
        }
        if (loadingSrc) {
          var img = $("<img />").attr('src', loadingSrc)
          if (img.complete) {
            giveImage(loadingSrc);
          } else {
            img.on('load', function() {
                giveImage(loadingSrc);
              })
              .on('error', function() {
                // giveImage('assets/images/no-preview-available.png');
              })
          }
        }



        function giveImage(src) {
          $(figure).css('background-image', 'url(' + src + ')');
          $(figure).removeClass('preload_background')
          $(figure).addClass('loaded');
          //$(figure).data('src', '');
        }
      }



      var $images = $('.lazyload-bg');

      for (var i = 0; i < $images.length; i++) {

        var scene = new ScrollMagic.Scene({ triggerElement: $images[i], triggerHook: 'onEnter' })
          .on('enter', function() {
            var triggerElem = this.triggerElement();
            processFigure(triggerElem);
            window.addEventListener('resize', function() {
              processFigure(triggerElem)
            })
          })
          .addTo(controller);

      }
    },

    // detect animation on scroll
    detectAnimation() {
      var controller = new ScrollMagic.Controller();
      var elem = $('.detect-animate');

      elem.each(function() {
        var elem = this;
        var triggerElem = $(elem).data('top') ? $(elem).data('top') : elem;
        var elementAnimation = $(elem).data('animation');
        var delay = $(elem).data('delay') ? $(elem).data('delay') : 0;
        var speed = $(elem).data('speed') ? $(elem).data('speed') : 1;
        var hook = $(elem).data('hook') ? $(elem).data('hook') : 'onCenter';
        var offset = -200;
        var tween = '';
        var duration = $(elem).data('scroll-hook-duration') ? $(elem).data('scroll-hook-duration') : 0;
        var reverse = $(elem).data('reverse') ? true : false;
        var staggerOffset = $(elem).data('stagger') ? $(elem).data('stagger') : 0.1;
        var from = $(elem).data('from') ? $(elem).data('from') : 0
        var to = $(elem).data('to') ? $(elem).data('to') : 0

        TweenLite.set(elem, { autoAlpha: 1 });

        switch (elementAnimation) {
          case "fade-in":
            tween = TweenMax.from(elem, speed, { autoAlpha: 0, ease: Ease.ease, delay: delay });
            break;
          case "from-top":
            tween = TweenMax.from(elem, speed, { y: '-100px', opacity: 0, ease: Ease.ease, delay: delay });
            break;
          case "from-top-jerk":
            tween = TweenMax.from(elem, speedspeed, { y: '-100px', opacity: 0, ease: Back.easeInOut, delay: delay });
            break;
          case "from-bottom":
            tween = TweenMax.from(elem, speed, { y: '100px', opacity: 0, ease: Ease.ease, delay: delay });
            break;
          case "from-bottom-jerk":
            tween = TweenMax.from(elem, speed, { y: '100px', opacity: 0, ease: Back.easeInOut, delay: delay });
            break;
          case "from-left":
            tween = TweenMax.from(elem, speed, { x: '-100px', opacity: 0, ease: Ease.ease, delay: delay });
            break;
          case "from-left-jerk":
            tween = TweenMax.from(elem, speed, { x: '-100px', opacity: 0, ease: Back.easeInOut, delay: delay });
            break;
          case "from-right":
            tween = TweenMax.from(elem, speed, { x: '100px', opacity: 0, ease: Ease.ease, delay: delay });
            break;
          case "from-right-jerk":
            tween = TweenMax.from(elem, speed, { x: '100px', opacity: 0, ease: Back.easeInOut, delay: delay });
            break;
          case "from-bottom-elements-lazy":
            tween = TweenMax.staggerFrom($(elem).find('>*'), speed, { y: '100px', opacity: 0, ease: Ease.ease, delay: delay }, staggerOffset);
            break;
          case "from-bottom-elements-lazy-jerk":
            tween = TweenMax.staggerFrom($(elem).find('>*'), speed, { y: '100px', opacity: 0, ease: Back.easeInOut, delay: delay }, staggerOffset);
            break;
          case "from-left-elements-lazy":
            tween = TweenMax.staggerFrom($(elem).find('>*'), speed, { x: '-100px', opacity: 0, ease: Ease.ease, delay: delay }, staggerOffset);
            break;
          case "from-left-elements-lazy-jerk":
            tween = TweenMax.staggerFrom($(elem).find('>*'), speed, { x: '-100px', opacity: 0, ease: Back.easeInOut, delay: delay }, staggerOffset);
            break;
          case "from-right-elements-lazy":
            tween = TweenMax.staggerFrom($(elem).find('>*'), speed, { x: '100px', opacity: 0, ease: Ease.ease, delay: delay }, staggerOffset);
            break;
          case "from-right-elements-lazy-jerk":
            tween = TweenMax.staggerFrom($(elem).find('>*'), speed, { x: '100px', opacity: 0, ease: Back.easeInOut, delay: delay }, staggerOffset);
            break;
          case "from-top-elements-lazy":
            tween = TweenMax.staggerFrom($(elem).find('>*'), speed, { y: '-100px', opacity: 0, ease: Ease.ease, delay: delay }, staggerOffset);
            break;
          case "from-bottom-items-lazy":
            tween = TweenMax.staggerFrom($(elem).find('.animate-item'), speed, { y: '100px', opacity: 0, ease: Ease.ease, delay: delay }, staggerOffset);
            break;
          case "from-bottom-items-lazy-jerk":
            tween = TweenMax.staggerFrom($(elem).find('.animate-item'), speed, { y: '100px', opacity: 0, ease: Back.easeInOut, delay: delay }, staggerOffset);
            break;
          case "from-left-items-lazy":
            tween = TweenMax.staggerFrom($(elem).find('.animate-item'), speed, { x: '-100px', opacity: 0, ease: Ease.ease, delay: delay }, staggerOffset);
            break;
          case "from-left-items-lazy-jerk":
            tween = TweenMax.staggerFrom($(elem).find('.animate-item'), speed, { x: '-100px', opacity: 0, ease: Back.easeInOut, delay: delay }, staggerOffset);
            break;
          case "from-bottom-scroll":
            tween = TweenMax.fromTo(elem, speed, {
              y: from,
              ease: Power0.easeNone,
            }, {
              y: to,
              ease: Power0.easeNone,
              delay: delay
            });
            break;
          default:
            tween = '';
        };

        new ScrollMagic.Scene({ triggerElement: triggerElem, triggerHook: hook, offset: offset, duration: duration, reverse: reverse })
          .setTween(tween)
          .addTo(controller);


      })
    },

    parallaxBg () {
      let pBg = $('.parallax-bg'),
          controller = new ScrollMagic.Controller();

      pBg.each(function(){
        let elem = this,
            duration = $(elem).data('duration') ? $(elem).data('duration') : '300%',
            hook = $(elem).data('hook') ? $(elem).data('hook') : 'onEnter',
            tween = null

            tween = new TimelineMax()
            tween = TweenMax.to(elem, 5, {y : 400, rotation:0.01, ease: Power0.easeNone})

            new ScrollMagic.Scene({ triggerElement: elem, triggerHook: hook, duration: duration, reverse: true })
            .setTween(tween)
            .addTo(controller);
      })

    }

  }

  Qobj._init()

})(jQuery)
