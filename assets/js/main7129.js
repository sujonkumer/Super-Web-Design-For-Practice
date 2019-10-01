jQuery(function ($) {
	"use strict";

	if (!Array.from) {
		Array.from = (function () {
			var toStr = Object.prototype.toString;

			var isCallable = function isCallable(fn) {
				return (
					typeof fn === "function" || toStr.call(fn) === "[object Function]"
				);
			};

			var toInteger = function toInteger(value) {
				var number = Number(value);

				if (isNaN(number)) {
					return 0;
				}

				if (number === 0 || !isFinite(number)) {
					return number;
				}

				return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
			};

			var maxSafeInteger = Math.pow(2, 53) - 1;

			var toLength = function toLength(value) {
				var len = toInteger(value);
				return Math.min(Math.max(len, 0), maxSafeInteger);
			};

			return function from(arrayLike) {
				var C = this;
				var items = Object(arrayLike);

				if (arrayLike == null) {
					throw new TypeError(
						"Array.from requires an array-like object - not null or undefined"
					);
				}

				var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
				var T;

				if (typeof mapFn !== "undefined") {
					if (!isCallable(mapFn)) {
						throw new TypeError(
							"Array.from: when provided, the second argument must be a function"
						);
					}

					if (arguments.length > 2) {
						T = arguments[2];
					}
				}

				var len = toLength(items.length);
				var A = isCallable(C) ? Object(new C(len)) : new Array(len);
				var k = 0;
				var kValue;

				while (k < len) {
					kValue = items[k];

					if (mapFn) {
						A[k] =
							typeof T === "undefined" ?
							mapFn(kValue, k) :
							mapFn.call(T, kValue, k);
					} else {
						A[k] = kValue;
					}

					k += 1;
				}

				A.length = len;
				return A;
			};
		})();
	}

	if (!Array.prototype.find) {
		Object.defineProperty(Array.prototype, "find", {
			value: function value(predicate) {
				if (this == null) {
					throw new TypeError('"this" is null or not defined');
				}

				var o = Object(this);
				var len = o.length >>> 0;

				if (typeof predicate !== "function") {
					throw new TypeError("predicate must be a function");
				}

				var thisArg = arguments[1];
				var k = 0;

				while (k < len) {
					var kValue = o[k];

					if (predicate.call(thisArg, kValue, k, o)) {
						return kValue;
					}

					k++;
				}

				return undefined;
			}
		});
	}

	if ("NodeList" in window && !NodeList.prototype.forEach) {
		NodeList.prototype.forEach = function (callback, thisArg) {
			thisArg = thisArg || window;

			for (var i = 0; i < this.length; i++) {
				callback.call(thisArg, this[i], i, this);
			}
		};
	}

	var ua = window.navigator.userAgent;
	var is_ie = /MSIE|Trident/.test(ua);

	if (is_ie) {
		var importIEJS = function importIEJS(callback) {
			var elements = $('.app-aside');
			if (elements.length > 0) {
				var script = document.createElement('script');
				script.src = 'assets/js/stickyfill.min.js';
				script.type = 'text/javascript';
				document.getElementsByTagName('head')[0].appendChild(script);
				setTimeout(function () {
					Stickyfill.add(elements)
				}, 1000);
			}
			setTimeout(function () {
				callback();
			}, 50);
		};
		var reSetImgs = function reSetImgs() {
			$(
				".article-figure, .app-aside-widget-slide, .team-members-item-figure, .testimonial-avatar, .latest-news-box figure, .services-list-item-figure, .main-hero-item.slick-slide > figure, .app-statistics-item-figure, .portfolio-list-item > figure.thumbnail"
			).each(function () {
				var $container = $(this),
					imgUrl = $container.find("img").prop("src");
				var width, height;
				(width = $container.css("width") || $container.parent().outerWidth()),
				(height =
					$container.css("height") || $container.parent().outerHeight());
				var cls = $container.attr("class");
				var minHeight;

				if (cls == "team-members-item-figure") {
					minHeight = height;
					height = "";
				}

				if (imgUrl) {
					$container
						.css({
							backgroundImage: "url(" + imgUrl + ")",
							width: width,
							height: height,
							minHeight: minHeight
						})
						.addClass("ie-object-fit");
				}
			});
		};
		importIEJS(reSetImgs);
		var resizeTimer;
		$(window).on('resize', function (e) {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function () {
				reSetImgs();
			}, 250);
		});
	}

	function _toConsumableArray(arr) {
		if (Array.isArray(arr)) {
			for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
				arr2[i] = arr[i];
			}
			return arr2;
		} else {
			return Array.from(arr);
		}
	}
	// smooth side scroll
	function sideScroll(element, direction, speed, distance, step) {
		var scrollAmount = 0;
		var slideTimer = setInterval(function () {
			if (direction == "left") {
				element.scrollLeft -= step;
			} else {
				element.scrollLeft += step;
			}
			scrollAmount += step;
			if (scrollAmount >= distance) {
				window.clearInterval(slideTimer);
			}
		}, speed);
	}

	// active class toggle methods
	var removeClasses = function removeClasses(nodes, value) {
		if (nodes)
			nodes.forEach(function (node) {
						node.classList.contains(value) && node.classList.remove(value);
			})
		else return false;
	};
	var addClass = function addClass(nodes, index, value) {
		return nodes ? nodes[index].classList.add(value) : 0;
	};
	var App = {
		initHeroSlider: function initHeroSlider() {
			$(".main-hero-wrapper").slick({
				dots: false,
				swipe: true,
				autoplay: true,
				autoplaySpeed: 3000,
				mobileFirst: true,
				prevArrow: $(".main-hero-navigation.prev"),
				nextArrow: $(".main-hero-navigation.next"),
				slide: ".main-hero-item",
				responsive: [{
					breakpoint: 991,
					settings: {
						swipe: false
					}
				}]
			});
		},
		initHeroSliderAlternative:function initHeroSlider() {
			jQuery(document).ready(function ($) {
				//Selectors
				var mainSlider = $('.main-slider');
	
				//slide init
				mainSlider.on('init', function(event, slick){	
						var thisflex = $('.slick-current').find('[data-animation]');
						doAnimations(thisflex);
					});
				mainSlider.slick({
					infinite: true,
					nextArrow:'<div class="slick-next"><img src="assets/img/cursor-right.png" srcset="assets/img/cursor-right@2x.png 2x"></img></div>',
					prevArrow:'<div class="slick-prev"><img src="assets/img/cursor-left.png" srcset="assets/img/cursor-left@2x.png 2x"></img></div>'
				});
				
				mainSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
						var thisflex = $('[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
						doAnimations(thisflex);
				});
	
				//After init doing animations
				function doAnimations(elements) {
							var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
							elements.each(function() {
									var $this = $(this);
									var $animationDelay = $this.data('delay');
									var $animationDuration = $this.data('duration');
									var $animationType = 'animated ' + $this.data('animation');
									$this.css({
											'animation-delay': $animationDelay,
											'-webkit-animation-delay': $animationDelay,
											'animation-duration': $animationDuration
									});
									$this.addClass($animationType).one(animationEndEvents, function() {
											$this.removeClass($animationType);
									});
							});
					}
				
			//Background
			$('.slide-background').each(function () {
					var $this = $(this);
					var dataColor = $(this).attr('data-color');
					var dataTextColor = $(this).attr('data-text-color');
					if(dataColor) {
						$this.css({
							'background-color':dataColor
						})
					}
					if(dataTextColor) {
						$this.parent().find('h2,p').css({
							'color':dataTextColor
						});
					}
					
					var slideBg = $(this).find('img').attr('src');
					$(this).css({
						'background-image':'url('+slideBg+')'
					})

				})
				
			});
		},


		initAsideSlider: function initAsideSlider() {
			$(".js-aside-slider").slick({
				dots: false,
				swipe: false,
				slide: ".app-aside-widget-slide",
				prevArrow: document.querySelector(
					".aside-carousel-navigation-btn.prev"
				),
				nextArrow: document.querySelector(
					".aside-carousel-navigation-btn.next"
				),
				autoplay: true,
				autoplaySpeed: 3000
			});
		},
		initServicesHexagon: function initServicesHexagon() {
			// services hexagon
			var hexagons = document.querySelectorAll(
				".main-our-services-hexagon--small"
			);
			var hexagonContents = document.querySelectorAll(
				".main-our-services-content-item"
			);
			var parent = document.querySelector(".main-our-services-hexagon--big");
			if (parent) {
				var spreadHexagons = function spreadHexagons() {
					// spread the subhexagons around the hexagon
					var parentHexagon = parent.getBoundingClientRect();
					Array.from(hexagons).forEach(function (hexagon, index) {
						var angle = void 0,
							angle_rad = void 0,
							r = void 0,
							x = void 0,
							y = void 0;
						angle = index * (360 / hexagons.length);
						angle_rad = (Math.PI / 180) * angle;
						var safe = 127;
						if (window.innerWidth <= 1100) safe = 100;
						if (window.innerWidth <= 992) safe = 90;
						if (window.innerWidth <= 576) safe = 55;
						if (window.innerWidth >= 992) {
							if (window.innerHeight <= 950) safe = 85;
						}
						r = parentHexagon.height / 2 + safe;
						x = parseInt(r * Math.sin(angle_rad));
						y = parseInt(r * Math.cos(angle_rad));

						if (x == 0) {
							y -= 16;
						}
						if (x <= 5 && x > 0) {
							x = 0;
							y += 16;
						}
						hexagon.style.transform = "translate3d(" + x + "px," + y + "px,0)";
					});
				};
				spreadHexagons();
				var resizeTimer = void 0;
				window.addEventListener("resize", function () {
					clearTimeout(resizeTimer);
					resizeTimer = setTimeout(function () {
						spreadHexagons();
					}, 50);
				});
				hexagons.forEach(function (hexagon, index) {
					var hexagonsToggleFnc = function hexagonsToggleFnc() {
						var index = hexagon.dataset.hexagonIndex;
						if (!hexagon.classList.contains("active")) {
							var _iconEl$classList;

							removeClasses(hexagons, "active");
							removeClasses(hexagonContents, "active");
							addClass(hexagons, index, "active");
							addClass(hexagonContents, index, "active");
							var iconEl = hexagonContents[index].querySelector(".icon");
							var iconClass = hexagon
								.querySelector("i")
								.classList.value.split(" ");
							(_iconEl$classList = iconEl.classList).add.apply(
								_iconEl$classList,
								_toConsumableArray(iconClass)
							);
						}
					};
					hexagon.addEventListener("click", hexagonsToggleFnc, true);
					hexagon.addEventListener("mouseover", hexagonsToggleFnc, true);
				});
			}
		},

		initContactFormToggle: function initContactFormToggle() {
			// contact form toggle
			var contactFormBtn = document.getElementsByClassName(
				"main-map-form-trigger"
			)[0];
			var contactFormCloseBtn = document.querySelector(
				".main-map-form-title-wrapper .form-close"
			);
			var contactFormWrapper = document.querySelector(".main-map-form");
			if (contactFormBtn && contactFormWrapper && contactFormCloseBtn) {
				contactFormBtn.addEventListener("click", function (e) {
					e.preventDefault();
					if (!contactFormWrapper.classList.contains("form-active")) {
						contactFormWrapper.classList.add("form-active");
						contactFormBtn.classList.add("disabled");
						$("html, body").animate({
								scrollTop: $(contactFormWrapper).offset().top - 120
							},
							400
						);
					}
				});
				contactFormCloseBtn.addEventListener("click", function () {
					if (contactFormWrapper.classList.contains("form-active")) {
						contactFormWrapper.classList.remove("form-active");
						contactFormBtn.classList.remove("disabled");
					}
				});
			}
		},

		initResponsivePortfolio: function initResponsivePortfolio() {
			// tabs nav responsive
			var tabsToggle = document.querySelectorAll(".mobile-tab-toggle-btn");
			var tabsNav = document.querySelector(".app-tab-filter-wrapper");
			var tabsContent = document.querySelector(".app-tab-filter");
			if (tabsNav && tabsContent) {
				tabsToggle.forEach(function (tabsToggleBtn) {
					return tabsToggleBtn.addEventListener("click", function () {
						if (tabsContent.classList.contains("show-me"))
							tabsContent.classList.remove("show-me");
						else tabsContent.classList.add("show-me");
					});
				});
				var links = tabsContent.querySelectorAll(".app-tab-filter-item");
				links.forEach(function (link, i) {
					link.addEventListener("click", function () {
						$("html, body").animate({
								scrollTop: 50
							},
							400
						);
						tabsContent.classList.remove("show-me");
						if (i == 0) tabsContent.scrollTop = 0;
						else if (i == links.length - 1)
							tabsContent.scrollTop =
							tabsContent.scrollHeight - tabsContent.clientHeight;
						else tabsContent.scrollTop = link.offsetTop - 75;
					});
				});
			}
		},
		truncateLine: function truncateLine(el, line) {
			var truncateElement = document.querySelectorAll(el);
			var getLineHeight = function getLineHeight(element) {
				var lineHeight = window.getComputedStyle(element)["line-height"];
				if (lineHeight === "normal") {
					return (
						1.16 * parseFloat(window.getComputedStyle(element)["font-size"])
					);
				} else {
					return parseFloat(lineHeight);
				}
			};
			var applyTruncate = function applyTruncate(nodeToTruncate) {
				if (nodeToTruncate) {
					var truncateText = nodeToTruncate.textContent;
					nodeToTruncate.innerHTML = truncateText;
					var truncateTextParts = truncateText.split(" ");
					var lineHeight = getLineHeight(nodeToTruncate);
					var lines = parseInt(line);
					while (lines * lineHeight < nodeToTruncate.clientHeight) {
						truncateTextParts.pop();
						nodeToTruncate.innerHTML = truncateTextParts.join(" ") + "...";
					}
				}
			};
			truncateElement.forEach(function (subEl) {
				applyTruncate(subEl);
			});
		},
		initPortfolioIsotope: function initPortfolioIsotope() {
			var parent = document.querySelector(".portfolio-items-wrapper");
			if (parent) {
				var portfolioIsotope = new Isotope(".portfolio-items-wrapper", {
					itemSelector: ".portfolio-list-item--wrapper",
					layoutMode: "fitRows"
				});
				var tabFilterItems = document.querySelectorAll(".app-tab-filter-item");
				tabFilterItems.forEach(function (item, index) {
					item.addEventListener("click", function () {
						removeClasses(tabFilterItems, "active");
						addClass(tabFilterItems, index, "active");
						var filterValue = item.dataset.filter;
						if (filterValue != "*")
							filterValue = "[data-category=" + filterValue + "]";
						portfolioIsotope.arrange({
							filter: filterValue
						});
					});
				});
			}
		},
		initNavbarSearch: function initNavbarSearch() {
			var form = document.querySelector(".app-navbar-search");
			if (form) {
				var navbar = document.querySelector(".app-navbar-ul");
				if (window.innerWidth >= 992) {
				 var centerLogo = document.querySelector(".logo-centered .app-navbar-logo");
				}
 				var input = form.querySelector(".input-wrapper");
				var searchTrigger = document.querySelector(".app-navbar-search-btn");
				var searchCloseTrigger = document.querySelector(
					".app-navbar-search-btn-close"
				);
				var showSearch = function showSearch() {
					navbar.classList.add("hide-me");
					searchTrigger.classList.add("hide-me");
					if(centerLogo) {
						centerLogo.classList.add("hide-me");
					}
					input.classList.add("active");
					input.querySelector("input").focus();
					document.addEventListener("click", outsideClickListener);
				};
				var hideSearch = function hideSearch() {
					navbar.classList.remove("hide-me");
					searchTrigger.classList.remove("hide-me");
					if(centerLogo) {
						centerLogo.classList.remove("hide-me");
					}
					input.classList.remove("active");
					document.removeEventListener("click", outsideClickListener);
				};
				var outsideClickListener = function outsideClickListener(e) {
					e.stopPropagation();
					if (!form.contains(e.target)) return hideSearch();
				};
				var toggleSearch = function toggleSearch() {
					if (input.classList.contains("active")) {
						hideSearch();
					} else {
						showSearch();
					}
				};
				input.querySelector("input").addEventListener("keyup", function (e) {
					e.preventDefault();
					if (e.keycode == 13) {
						form.submit();
					}
				});
				searchTrigger.addEventListener("click", function (e) {
					toggleSearch();
				});
				searchCloseTrigger.addEventListener("click", function (e) {
					toggleSearch();
				});
			}
		},
		initTeamMembersItems: function initTeamMembersItems() {
			var items = document.querySelectorAll(".team-members-item");
			if (items) {
				var applyHeight = function applyHeight() {
					items.forEach(function (item) {
						var h = item.getBoundingClientRect().height;
						item.classList.add("js-team-member-h");
						if (window.innerWidth >= 992) {
							if (!item.hasAttribute("style")) {
								item.setAttribute("style", "height:" + (h + 32) + "px");
							}
						} else {
							item.setAttribute("style", "height:inherit");
						}
					});
				};
				applyHeight();
				window.addEventListener("resize", function () {
					var width = window.innerWidth;
					if (width >= 992) {
						applyHeight();
					}
				});
			}
		},
		initTabNavs: function initTabNavs() {
			var tabNavs = document.querySelectorAll(
				".app-tabnav:not(.app-tabnav--vert) .app-tabnav--navs .nav"
			);
			if (tabNavs) {
				tabNavs.forEach(function (nav) {
					if (nav.offsetWidth < nav.scrollWidth) {
						// tab is overflowed
						var links = Array.from(nav.querySelectorAll(".nav-link"));
						links.forEach(function (link, index) {
							link.addEventListener("click", function () {
								var activeIndex = links.indexOf(
									links.find(function (l) {
										return l.classList.contains("active");
									})
								);
								if (activeIndex !== index) {
									if (index == 0)
										sideScroll(nav, "left", 25, nav.scrollLeft, 10);
									else if (index == links.length - 1) {
										sideScroll(
											nav,
											"right",
											25,
											nav.scrollWidth - nav.clientWidth,
											10
										);
									} else {
										var direction = void 0;
										var val;
										if (activeIndex > index) {
											direction = "left";
										} else {
											direction = "right";
										}
										if (direction == "left") {
											val = link.offsetLeft + link.offsetWidth;
										} else {
											val = link.offsetLeft - link.offsetWidth;
										}

										sideScroll(nav, direction, 15, val, 10);
									}
								}
							});
						});
					}
				});
			}
		},
		initTestimonial: function initTestimonial() {
			var node = document.querySelector(".js-testimonial-slider");
			if (node) {
				var arrows = document.querySelector(".app-testimonial-navigation");
				var setArrowsPosition = function setArrowsPosition(slide, isInit) {
					var slideRect = slide.getBoundingClientRect();
					if (!isInit) arrows.classList.add("hide-me");
					var avatarRect = slide
						.querySelector(".testimonial-avatar")
						.getBoundingClientRect();
					arrows.style.top =
					avatarRect.top - slideRect.top + avatarRect.height / 2 + "px";						
					if (!isInit)
						setTimeout(function () {
							arrows.classList.remove("hide-me");
						}, 300);
				};

				$(node).on("beforeChange", function (e, slick, current, next) {
					var currSlide = this.querySelector(
						".slick-slide[data-slick-index='" + next + "']"
					);
					setArrowsPosition(currSlide, false);
				});
				$(node).on("init", function (e, slick) {
					setArrowsPosition(slick.$slides[0], true);
				});
				$(node).slick({
					dots: false,
					swipe: false,
					slide: ".app-testimonial-item",
					prevArrow: document.querySelector(".app-testimonial-navigation-prev"),
					nextArrow: document.querySelector(".app-testimonial-navigation-next"),
					autoplay: true,
					autoplaySpeed: 5000
				});
			}
		},
		initAppCarousel: function initAppCarousel() {
			var node = document.querySelector(".js-app-carousel");
			$(node).slick({
				dots: true,
				swipe: true,
				arrows: false,
				autoplay: true,
				autoplaySpeed: 3000,
				adaptiveHeight: true
			});
		},
		initNotFoundPage: function initNotFoundPage() {
			var node = document.querySelector(".page-404-wrapper");
			if (node && !is_ie) {
				if (node) {
					var bg = document
						.querySelector(".page-hero-cover img")
						.getAttribute("src");
					node
						.querySelector("span.title")
						.setAttribute("style", "background-image:url('" + bg + "')");
				}
			}
		},
		initStickyNavbar: function initStickyNavbar() {
			var navbar = document.querySelector("nav.app-navbar.app-navbar--sticky");
			var bodyClass = "navbar--fixed";
			var fixedBody = "body.navbar--fixed";
			if (navbar) {
				var rect = navbar.getBoundingClientRect();
				var applyNavbar = function applyNavbar(scroll) {
					var height = rect.height;
					var headerHeight = Array.from(
						document.querySelector("header").children
					).reduce(function (acc, child) {
						return acc + child.getBoundingClientRect().height;
					}, 0);
					var top = headerHeight - height;
					if (scroll > top) {
						document.body.classList.add(bodyClass);
						document.querySelector(fixedBody).style.paddingTop = height + "px";
					} else if (scroll < height) {
						if (document.body.classList.contains(bodyClass)) {
							document.querySelector(fixedBody).style.paddingTop = 0;
							document.body.classList.remove(bodyClass);
						}
					}
				};
				window.addEventListener("load", function () {
					return applyNavbar(
						window.scrollY || document.documentElement.scrollTop
					);
				});
				window.addEventListener("scroll", function () {
					return applyNavbar(
						window.scrollY || document.documentElement.scrollTop
					);
				});
			}
		},
		initHomeServicesCarousel: function initHomeServicesCarousel() {
			var node = $(".featured-services .section-content .row");
			if (node) {
				node.slick({
					dots: true,
					arrows: false,
					autoplay: true,
					autoplaySpeed: 3000,
					slidesToShow: 1,
					slidesToScroll: 1,
					mobileFirst: true,
					responsive: [{
							breakpoint: 991,
							settings: "unslick"
						},
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2
							}
						}
					]
				});
				window.addEventListener("resize", function () {
					if (window.innerWidth <= 991) node.slick("resize");
				});
			}
		},
		initHomeTeamMembers: function initHomeTeamMembers() {
			var node = $(".team-members .section-content .row");
			if (node) {
				node.slick({
					dots: true,
					arrows: false,
					autoplay: true,
					autoplaySpeed: 3000,
					slidesToShow: 1,
					slidesToScroll: 1,
					mobileFirst: true,
					responsive: [{
							breakpoint: 991,
							settings: "unslick"
						},
						{
							breakpoint: 700,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 3
							}
						},
						{
							breakpoint: 450,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2
							}
						}
					]
				});
				window.addEventListener("resize", function () {
					if (window.innerWidth <= 991) node.slick("resize");
				});
			}
		},
		initHomeServicesType3: function initHomeServicesType3() {
			var node = $(".featured-services-type-3 .section-content .row");
			if (node) {
				node.slick({
					nextArrow:'<div class="slick-next"><i class="fas fa-chevron-right"></i></div>',
					prevArrow:'<div class="slick-prev"><i class="fas fa-chevron-left"></i></div>',
					dots: false,
					autoplay: false,
					autoplaySpeed: 3000,
					slidesToShow: 3,
					slidesToScroll: 3,
					centerMode: true,
					centerPadding: '0px',
					responsive: [{
							breakpoint: 991,
							slidesToShow: 2,
							slidesToScroll: 2
						},
						{
							breakpoint: 700,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2,
								centerMode: false,
							}
						},
						{
							breakpoint: 450,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1,
								centerMode: false,
							}
						}
					]
				});
				window.addEventListener("resize", function () {
					setTimeout(function () {
						if (window.innerWidth <= 991) node.slick("refresh");
					}, 500);
				});
			}
		},
		initTestimonialType1: function initTestimonialType1() {
			var node = $(".testimonials-type-1 .section-content .row");
			if (node) {
				node.slick({
					nextArrow:'<div class="slick-next"><i class="fas fa-chevron-right"></i></div>',
					prevArrow:'<div class="slick-prev"><i class="fas fa-chevron-left"></i></div>',
					dots: true,
					arrows:false,
					autoplay: false,
					autoplaySpeed: 3000,
					slidesToShow: 3,
					slidesToScroll: 3,
					centerMode: true,
					centerPadding: '0px',
					responsive: [{
							breakpoint: 991,
							slidesToShow: 2,
							slidesToScroll: 2
						},
						{
							breakpoint: 769,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1,
							}
						},
						{
							breakpoint: 450,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1,
							}
						}
					]
				});
				window.addEventListener("resize", function () {
					setTimeout(function () {
						if (window.innerWidth <= 991) node.slick("refresh");
					}, 500);
				});
			}
		},
		initBrandsCarousel: function initBrandsCarousel() {
			var node = $(".app-brands-wrapper");
			if (node) {
				node.slick({
					dots: false,
					arrows: false,
					autoplay: true,
					autoplaySpeed: 3000,
					slidesToShow: 1,
					slidesToScroll: 1,
					mobileFirst: true,
					responsive: [{
							breakpoint: 991,
							settings: "unslick"
						},
						{
							breakpoint: 576,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2
							}
						}
					]
				});
				window.addEventListener("resize", function () {
					if (window.innerWidth <= 991) node.slick("resize");
				});
			}
		},
		initAboutUsBoxes: function initAboutUsBoxes() {
			var node = $(".about-us-content-bottom");
			if (node) {
				node.slick({
					dots: false,
					arrows: false,
					autoplay: true,
					autoplaySpeed: 3000,
					slidesToShow: 1,
					slidesToScroll: 1,
					mobileFirst: true,
					responsive: [{
							breakpoint: 991,
							settings: "unslick"
						},
						{
							breakpoint: 576,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2
							}
						}
					]
				});
				window.addEventListener("resize", function () {
					if (window.innerWidth < 768) node.slick("resize");
				});
			}
		},
		initAboutUsServices: function initAboutUsServices() {
			var node = $(".about-us-section .section-content .row");
			if (node) {
				node.slick({
					dots: true,
					arrows: false,
					autoplay: true,
					autoplaySpeed: 3000,
					slidesToShow: 1,
					slidesToScroll: 1,
					mobileFirst: true,
					responsive: [{
							breakpoint: 991,
							settings: "unslick"
						},
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 2,
								slidesToScroll: 2
							}
						}
					]
				});
				window.addEventListener("resize", function () {
					if (window.innerWidth < 768) node.slick("resize");
				});
			}
		},
		initResponsiveNavbar: function initResponsiveNavbar() {
			var rightmenu = document.querySelector(".app-navbar-ul.right-menu");
			var leftmenu = document.querySelector(".app-navbar-ul.left-menu");

			var navMenu = document.querySelector(".app-navbar-ul");
			if (navMenu) {
				var navTrigger = document.querySelector("button.app-navbar-trigger");
				var bodyClass = "mobile-menu-opened";
				navTrigger.addEventListener("click", function () {
					var outsideClickListener = function outsideClickListener(e) {
						e.stopPropagation();
						if (e.target != navTrigger) {
							if (!navMenu.contains(e.target)) return hideMenu();
						}
					};
					var showMenu = function showMenu() {
						var headerHeight = Array.from(
							document.querySelector("header").children
						).reduce(function (acc, child) {
							return acc + child.getBoundingClientRect().height;
						}, 0);
						navMenu.style.height = window.innerHeight - headerHeight + "px";
						navMenu.classList.add("menu-open");
						document.addEventListener("click", outsideClickListener);
						document.body.classList.add(bodyClass);
					};
					var hideMenu = function hideMenu() {
						navMenu.classList.remove("menu-open");
						document.removeEventListener("click", outsideClickListener);
						document.body.classList.remove(bodyClass);
						navMenu
							.querySelectorAll(".app-navbar-ul-link.has-child")
							.forEach(function (link) {
								link
								    .querySelector(".app-navbar-ul-link-a")
									.classList.remove("first-click");
								if (link.hasAttribute("dropdown-visible"))
									link.setAttribute("dropdown-visible", false);
								if (
									link
									.querySelector(".app-navbar-dropdown")
									.classList.contains("navbar-dropdown-opened")
								)
									link
									.querySelector(".app-navbar-dropdown")
									.classList.remove("navbar-dropdown-opened");
							});
					};
					if (navMenu.classList.contains("menu-open")) {
						hideMenu();
					} else {
						showMenu();
					}
				});

				var menuLinks = navMenu.querySelectorAll(
					".app-navbar-ul-link.has-child"
				);

				var listenMenuLink = function listenMenuLink(el) {
					var dropdown = el.querySelector(".app-navbar-dropdown");
					var aLink = el.querySelector(".app-navbar-ul-link-a");
					var firstClickClass = "first-click";
					if (window.innerWidth <= 991) {
						dropdown.querySelectorAll("a").forEach(function (dlink) {
							dlink.addEventListener("click", function () {
								dropdown.style.transition = "none";
							});
						});
						if (aLink.getAttribute("href") != null) {
							aLink.addEventListener("click", function (e) {
								if (aLink.classList.contains(firstClickClass)) {
									dropdown.style.transition = "none";
									return true;
								} else {
									e.preventDefault();
									menuLinks.forEach(function (link) {
										var sl = link.querySelector('.app-navbar-ul-link-a');
										if (sl.classList.contains(firstClickClass))
											sl.classList.remove(firstClickClass);
									});
									aLink.classList.add(firstClickClass);
									return false;
								}
							});
						}
					}
					el.addEventListener("click", function () {
						if (window.innerWidth <= 991) {
							var dropdownClass = "navbar-dropdown-opened";
							if (dropdown.classList.contains(dropdownClass)) {
								dropdown.classList.remove(dropdownClass);
								el.setAttribute("dropdown-visible", false);
							} else {
								menuLinks.forEach(function (link) {
									return link.setAttribute("dropdown-visible", false);
								});
								removeClasses(
									navMenu.querySelectorAll(".app-navbar-dropdown"),
									dropdownClass
								);
								setTimeout(function () {
									dropdown.classList.add(dropdownClass);
									el.setAttribute("dropdown-visible", true);
								}, 1);
								if (aLink.getAttribute('href') == null) {
									menuLinks.forEach(function (link) {
										var sl = link.querySelector('.app-navbar-ul-link-a');
										if (sl.classList.contains(firstClickClass))
											sl.classList.remove(firstClickClass);
									});
								}
							}
						}

					});
				};
				var listenResponsiveMenu = function listenResponsiveMenu() {
					if (window.innerWidth >= 992) {
						if ($("header").hasClass("logo-centered")){
							console.log("111");
							var menu = $( ".app-navbar-container" );
						} else {
							var menu = $( ".app-navbar-ul" );
						}
						var dropdownWidth = menu.width();
					$('.has-mega-menu .app-navbar-dropdown').css({width:dropdownWidth, position:'absolute'});
					} else {
						if ($("header").hasClass("logo-centered")){
							var menu = $( ".app-navbar-container" );
						} else {
							var menu = $( ".app-navbar-ul" );
						}
						var dropdownWidth = menu.width();
						$('.has-mega-menu .app-navbar-dropdown').css({width:'auto', left:'initial', position:'initial'});
					}
					if(rightmenu) {
						var rightitemsinleft = leftmenu.querySelectorAll(".app-navbar-ul-link.right-menu-item");
						var rightitems = rightmenu.querySelectorAll(".app-navbar-ul-link");
					}

					if (window.innerWidth <= 991) {
						if(rightmenu) {
						if(rightitemsinleft.length == 0) {
							rightitems.forEach(function(rightitem){
 								var clone = $(rightitem).clone();
								$(clone).addClass("right-menu-item");
								$(".app-navbar-ul.left-menu").append(clone);
							})
							menuLinks = navMenu.querySelectorAll(
								".app-navbar-ul-link.has-child"
							);
						}
					}
						menuLinks.forEach(function (link) {
							link.addEventListener("click", listenMenuLink(link), true);
						});
					} else {
						if(rightmenu) {
						if(rightitemsinleft.length != 0){
							rightitemsinleft.forEach(function(rightitem){
								$(rightitem).remove();
							});
						 }
						}
						 menuLinks = navMenu.querySelectorAll(
							".app-navbar-ul-link.has-child"
						);
						menuLinks.forEach(function (link) {
							link.removeEventListener("click", listenMenuLink(link), true);
						});
						if (
							Array.from(menuLinks).some(function (el) {
								return el.hasAttribute("dropdown-visible");
							})
						) {
							menuLinks.forEach(function (link) {
								return link.removeAttribute("dropdown-visible");
							});
						}
						removeClasses(
							navMenu.querySelectorAll(".app-navbar-dropdown"),
							"navbar-dropdown-opened"
						);
					}
				};
				listenResponsiveMenu();
				window.addEventListener("resize", listenResponsiveMenu);
			}
		},
		initAccordionScroll: function initAccordionScroll() {
			var node = document.querySelector(".app-accordion");
			if (node) {
				$(node).on("shown.bs.collapse", function (e) {
					var headerHeight = Array.from(
						document.querySelector("header").children
					).reduce(function (acc, child) {
						return acc + child.getBoundingClientRect().height;
					}, 0);
					$("html,body").animate({
						scrollTop: $(e.target.parentElement).offset().top - headerHeight
					});
				});
			}
		},
		contactForm: function() { $('form#contact-us').submit(function() {
			$('form#contact-us .error').remove();
			var hasError = false;
			$('.requiredField').each(function() {
			  if($.trim($(this).val()) == '') {
				var labelText = $(this).prev('label').text();
				$(this).parent().append('<span class="error">'+labelText+' This field is required</span>');
				$(this).addClass('inputError');
				hasError = true;
			  } else if($(this).hasClass('email')) {
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				if(!emailReg.test($.trim($(this).val()))) {
				  $(this).parent().append('<span class="error"> Please enter a valid email address</span>');
				  $(this).addClass('inputError');
				  hasError = true;
				}
			  }
			});
			if(!hasError) {
				var formInput = $(this).serialize();
				$.post('contacts.php',formInput, function(data){
					$("form#contact-us .response").remove();
					$("form#contact-us").append('<div class="alert alert-primary mt-3" role="alert"><strong>Thank You! </strong> Your mail has arrived. The return will be made as soon as possible.. \
					<button class="close" data-dismiss="alert" type="button" aria-label="Close"><span aria-hidden="true">CLOSE</span></button> \
				  </div>');	
				});
			  }
			return false;	
		  });
		},
		initLogo: function(){
			var headerWithLogo = document.querySelector(
				".headbar-with-logo"
			);
			var listenLogo = function listenLogo () {
				if (window.innerWidth < 768) {
					$(".headbar-logo").prependTo(".app-navbar-container");
					} else {
						$(".headbar-logo").prependTo(".headbar-container");
					}
			}
			if(headerWithLogo) {
				listenLogo();
				window.addEventListener("resize", listenLogo);
			}
		}, 
		initCounter: function(){
			$(document).ready(function() {
				$('.counter').counterUp({
					delay: 10,
					time: 1000
				});
			});
 		}
	};
	
	App.initHeroSlider();
	App.truncateLine(".latest-news-box p.description", 2);
	App.truncateLine(".latest-news-box span.title", 1);
	App.truncateLine(".about-us-content-bottom-item p.description", 3);
	App.truncateLine(".featured-services-item-content p.description", 3);
	App.truncateLine(".home-about-us-box p.description", 5);
	App.truncateLine(".services-box-item p.description", 2);
	App.truncateLine(".app-aside-widget-rich-menu-item-content .title", 2);
	App.initContactFormToggle();
	App.initServicesHexagon();
	App.initPortfolioIsotope();
	App.initNavbarSearch();
	App.initAsideSlider();
	App.initTeamMembersItems();
	App.initTabNavs();
	App.initResponsivePortfolio();
	App.initTestimonial();
	App.initTestimonialType1();
	App.initAppCarousel();
	App.initNotFoundPage();
	App.initStickyNavbar();
	App.initHomeServicesCarousel();
	App.initResponsiveNavbar();
	App.initHomeTeamMembers();
	App.initBrandsCarousel();
	App.initAboutUsBoxes();
	App.initAboutUsServices();
	App.initAccordionScroll();
	App.contactForm();
	App.initLogo();
	App.initHeroSliderAlternative();
	App.initCounter();
	App.initHomeServicesType3();

	jQuery(document).ready(function ($) {
		var sectionsWithBg = $("section[data-background]");
		sectionsWithBg.each(function(section){
			var bgImage= $(this).attr("data-background");
			$(this).css("background-image", 'url('+bgImage+')');
		})

		var listenDropdown = function listenDropdown() {
			if (window.innerWidth > 992) {
				setTimeout(function(){ 	$(".app-navbar-ul").css("overflow","initial"); }, 500);
		
			$('.has-mega-menu').each(function () {
				var linormal = $(this).position().left;
				if(linormal < 1 ) {
				$(this).find('.app-navbar-dropdown').css({'left':-linormal,'position':'absolute'})
				} else {
				$(this).find('.app-navbar-dropdown').css({'left':-linormal-40,'position':'absolute'})
				}
				});
			}
			if (window.innerWidth >= 992) {
				if ($("header").hasClass("logo-centered")){
					console.log("111");
					var menu = $( ".app-navbar-container" );
				} else {
					var menu = $( ".app-navbar-ul" );
				}
				var dropdownWidth = menu.width();
			$('.has-mega-menu .app-navbar-dropdown').css({width:dropdownWidth, position:'absolute'});
			} else {
				if ($("header").hasClass("logo-centered")){
					var menu = $( ".app-navbar-container" );
				} else {
					var menu = $( ".app-navbar-ul" );
				}
				var dropdownWidth = menu.width();
				$('.has-mega-menu .app-navbar-dropdown').css({width:'auto', left:'initial', position:'initial'});
			}
		};
		listenDropdown();
		window.addEventListener("resize", listenDropdown);

		var bgWithImages = $(".background-with-image");
		if(bgWithImages) {
			bgWithImages.each(function(item){
				item = bgWithImages[item];
				var item2 = $(item).children("img")[0];
				var bgUrl = $(item2).attr("src");
				$(item).css("background", "url(" + bgUrl + ")");
				$(item).css("background-size", "cover");
			});
		}

		$(document).on('click', '[data-toggle="lightbox"]', function(event) {
			event.preventDefault();
			$(this).ekkoLightbox();
		});

	})
	 
});