jQuery(document).ready(function ($) {
  // Simple accordion functionality
  $('.accordion__group button').on('click', function (e) {
    e.preventDefault();

    // If item clicked on is open, close it
    if ($(this).closest('.accordion__group').hasClass('active')) {
      $(this).closest('.accordion__group').removeClass('active');
      $(this).closest('.accordion__group').find('.accordion__copy').slideUp();
    } else {
      // Otherwise, close all others and open the one clicked on
      $('.accordion__group').removeClass('active');
      $('.accordion__copy').slideUp();
      $(this).closest('.accordion__group').addClass('active');
      $(this).closest('.accordion__group').find('.accordion__copy').slideToggle();
    }
    if ($(this).is('[data-image]')) {
      var imageID = $(this).attr('data-image');
      $(this).closest('.image-accordions').find('.image').hide();
      $(this).closest('.image-accordions').find('#' + imageID).show();
      console.log('yup');
    }
  });
});
jQuery(document).ready(function ($) {
  // Show / hide address add form
  $('.customer--addresses .add-address').on('click', function (e) {
    $('#address-add').toggle();
    $('#address-list').toggle();
  });

  // Show / hide address add form
  $('.customer--addresses .add-address-cancel').on('click', function (e) {
    $('#address-add').toggle();
    $('#address-list').toggle();
  });
});
jQuery(document).ready(function ($) {
  /******************************************
    QTY Selector ( Simple quantity box increase / decrease )
   ******************************************/

  // PDP / PLP
  $('.js-qty:not(.js-qty--cart):not(.js-qty--mini)').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $parent = $this.parent();
    var qtyInput = $parent.find('input');
    var qtyInputVal = qtyInput.val();
    qtyInputVal = $.isNumeric(qtyInputVal) ? qtyInputVal : 1;
    if ($this.hasClass('js-qty--plus')) {
      qtyInputVal++;
      qtyInputVal = qtyInputVal < 1 ? 1 : qtyInputVal;
    } else {
      qtyInputVal--;
      qtyInputVal = qtyInputVal < 1 ? 1 : qtyInputVal;
    }
    qtyInput.val(qtyInputVal);
  });
  $('body').on('click', '.product--default .btn--atc', function () {
    var id = $(this).attr('data-id');
    CartJS.addItem(parseInt(id), 1, {}, {
      success: function success(data, textStatus, jqXHR) {
        jQuery.getJSON('/cart.js', function (cart) {
          refreshMiniCart(cart);
        });
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        //error state
        console.log('Error: ' + errorThrown + '!');
      }
    });
  });

  // MAIN CART

  // Allow typing of input qty for update
  var timer;
  $('.col__qty, .mobile-stuff').on('keyup', '.qty input', function () {
    var $this = $(this);
    var newVal = $this.val();
    var lineNum = $this.closest('.cart-row').attr('data-linenum');

    // clear the previous timer
    clearTimeout(timer);

    // create a new timer with a delay of 300ms seconds,
    // if the keyup is fired before the 300ms secs then the timer will be cleared
    timer = setTimeout(function () {
      // this will be executed if there is a gap of 300ms seconds between 2 keyup events
      CartJS.updateItem(lineNum, newVal, {}, {
        success: function success(data, textStatus, jqXHR) {
          location.reload();
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      });
    }, 300);
  });
  $('.col__qty, .mobile-stuff').on('click', '.js-qty--cart', function (e) {
    e.preventDefault();
    var $this = $(this);
    var qtyInput = $this.closest('.qty').find('input');
    var qtyInputVal = qtyInput.val();
    qtyInputVal = $.isNumeric(qtyInputVal) ? qtyInputVal : 1;
    var lineNum = $this.closest('.cart-row').attr('data-linenum');
    if ($this.hasClass('js-qty--plus')) {
      qtyInputVal++;
      qtyInputVal = qtyInputVal < 1 ? 1 : qtyInputVal;
    } else {
      qtyInputVal--;
      qtyInputVal = qtyInputVal < 1 ? 1 : qtyInputVal;
    }
    if (qtyInputVal >= 1) {
      console.log('got here');
      CartJS.updateItem(lineNum, qtyInputVal, {}, {
        success: function success(data, textStatus, jqXHR) {
          location.reload();
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      });
    } else {
      CartJS.removeItem(lineNum, {
        success: function success(data, textStatus, jqXHR) {
          location.reload();
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      });
    }
  });

  // MAIN CART REMOVE
  $('.actions .remove-product').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var lineID = $this.closest('.cart-row').attr('data-lineid');
    CartJS.removeItemById(lineID, {
      success: function success(data, textStatus, jqXHR) {
        location.reload();
      },
      error: function error(jqXHR, textStatus, errorThrown) {}
    });
  });

  /******************************************
    Options to change SM-RC Widget dropdowns
   ******************************************/

  // SELECT TYPE
  $('.option__wrap select').on('change', function () {
    var optionVal = $(this).val();
    var optionNum = $(this).closest('.option__wrap').attr('data-option');
    $('select[' + optionNum + ']').val(optionVal).change();
  });

  // BUTTON TYPE
  $('.option__wrap button').on('click', function (e) {
    var optionVal = $(this).attr('data-val');
    var optionNum = $(this).closest('.option__wrap').attr('data-option');

    // Set visual display of active
    $(this).closest('.option__wrap').find('button').removeClass('active');
    $(this).addClass('active');
    $('select[' + optionNum + ']').val(optionVal).change();
  });
  $('.template__product--liquid-hydrogen .option__wrap div.btn').on('click', function (e) {
    var optionVal = $(this).attr('data-val');
    var optionNum = $(this).closest('.option__wrap').attr('data-option');

    // Set visual display of active
    $(this).closest('.option__wrap').find('div.btn').removeClass('active');
    $(this).addClass('active');
    $('select[' + optionNum + ']').val(optionVal).change();
  });

  // RECHARE WIDGET VARIANTS
  $('.pdp__recharge input').on('click', function () {
    if ($(this).val() == 'rc-yes') {
      $('.form__group--rc').show();
      var planId = $(this).closest('.pdp__recharge').find('.frequency-select').val();
      $('[sm-rc-plan-selector]').val(planId).change();
    } else {
      $('.form__group--rc').hide();
      $('[sm-rc-plan-selector]').val('false').change();
    }
  });

  // RECHARE WIDGET SUBSCRIPTION PLAN
  $('.template__product .frequency-select').on('change', function () {
    var planId = $(this).val();
    $('[sm-rc-plan-selector]').val(planId).change();
  });
  $('.template__product--liquid-hydrogen #product-form').on('submit', function (e) {
    e.preventDefault(); // prevent the normal form submission

    var $form = $(this);
    var formData = $form.serialize(); // serialize form data for POST

    $.ajax({
      type: 'POST',
      url: '/cart/add.js',
      // Shopify AJAX API endpoint for add to cart
      data: formData,
      dataType: 'json',
      success: function success(response) {
        $.getJSON('/cart.js', function (cart) {
          refreshMiniCart(cart);
        });
        console.log('Added item:', response);
      },
      error: function error(xhr) {
        console.error('Error:', xhr.responseJSON);
      }
    });
  });
});
jQuery(document).ready(function ($) {
  // Make mobile category selector go to tag page
  $('.blog__tags select').on('change', function () {
    var tagUrl = $(this).val();
    window.location = tagUrl;
  });
});
jQuery(document).ready(function ($) {
  var links = document.links;
  for (var i = 0, linksLength = links.length; i < linksLength; i++) {
    if (links[i].hostname !== window.location.hostname) {
      links[i].target = '_blank';
    }
  }

  /******************************************
     Header Search
   ******************************************/

  // Show desktop search on click and focus on input
  $('.icon--search').on('click', function (e) {
    e.preventDefault();
    $('.header__bg').fadeIn(170);
    $('.desktop-search').fadeIn('fast', '', function () {
      $('body').addClass('search-open');
      $('.desktop-search input').focus();
    });
  });
  $('.icon--globe').on('click', function (e) {
    $('.header__bg').fadeIn(170);
    $('.country-select').fadeIn('fast', '', function () {
      $('body').addClass('search-open');
    });
  });
  $('.cta-chart .view-more button').on('click', function () {
    $(this).closest('.chart').find('.chart__row--hidden').removeClass('chart__row--hidden');
    $(this).closest('.chart').find('.chart__row--opacity').removeClass('chart__row--opacity');
    $(this).closest('.view-more').hide();
  });
  $('.card .swatches .swatch').hover(function () {
    var imgSrc = $(this).attr('data-image');
    if (imgSrc) {
      // Preload the image
      var img = new Image();
      img.src = imgSrc;
    }
  });
  $('.card .swatches .swatch').on('click', function () {
    var dataImage = $(this).attr('data-image');
    var dataImageSrcset = $(this).attr('data-image-srcset');
    var dataColor = $(this).attr('data-color');
    console.log(dataImage);
    if (dataImage.indexOf('no-image') === -1) {
      var newImage = '<img src="' + dataImage + '" srcset="' + dataImageSrcset + '" class="image--swatch" data-color="' + dataColor + '" style="background:#fff;"/>';
      $(this).closest('.card').find('.card__image a').append(newImage);
      $(this).closest('.card').find('.image--swatch').fadeIn(300);
      $(this).closest('.card').find('.swatch').removeClass('swatch--active');
      $(this).addClass('swatch--active');
    }
  });
  $('.card .swatches .swatch').on('mouseleave', function () {
    $(this).closest('.card').find('.image--swatch').fadeOut(400, function () {
      $(this).closest('.card').find('.image--swatch').remove();
    });
    $(this).removeClass('swatch--active');
  });

  // Close desktop search if click outside
  $('body').on('click', function (e) {
    var desktopSearch = $('.desktop-search, .country-select');
    if (!desktopSearch.is(e.target) && desktopSearch.has(e.target).length === 0 && $('body').hasClass('search-open')) {
      desktopSearch.fadeOut(170, '', function () {
        $('body').removeClass('search-open');
        $('.icon--search').focus();
        $('.header__bg').fadeOut(170);
      });
    }
  });
  $('.mobile-menu .top-level.has-children a').on('click', function (e) {
    e.preventDefault();
    var dataTitle = $(this).attr('data-title');
    $('.mobile-menu__front').fadeOut(170, function () {
      $('.mobile-menu__back[data-title="' + dataTitle + '"]').fadeIn(170);
    });
  });
  $('.mobile-menu .sub__heading .back').on('click', function () {
    $('.mobile-menu__back').fadeOut(170, function () {
      setTimeout(function () {
        $('.mobile-menu__front').fadeIn(220);
      }, 150);
    });
  });

  /******************************************
     Mobile Menu
   ******************************************/

  // Trigger mobile menu display
  $('.header__mobile-trigger button').on('click', function () {
    $('html').toggleClass('mobile-menu-open');
    $(this).toggleClass('is-active');
    $('.header__bg').fadeToggle(170);
    $('.mobile-menu').fadeToggle('fast', '', function () {});
  });

  /******************************************
     Modals
   ******************************************/

  // Launch the modal
  $('.btn--modal').on('click', function (e) {
    e.preventDefault();
    var modalID = '#' + $(this).attr('data-modal');
    if ($(this)[0].hasAttribute('data-video-yt')) {
      var videoID = $(this).attr('data-video-yt');
      $(modalID).find('.modal__inner').append('<div class="iframe-wrap"><iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoID + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
    }
    if ($(this)[0].hasAttribute('data-video-vimeo')) {
      var videoID = $(this).attr('data-video-vimeo');
      $(modalID).find('.modal__inner').append('<div class="iframe-wrap"><iframe width="560" height="315" src="https://player.vimeo.com/video/' + videoID + '"  frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen allowfullscreen></iframe></div>');
    }
    $(modalID).fadeIn('fast');
  });

  // Close the modal
  $('.modal--close, .modal__bg').on('click', function (e) {
    closeModal($(this));
  });
});
function closeModal(object) {
  object.closest('.modal').fadeOut('fast', function () {
    $('.modal__inner .iframe-wrap').remove();
  });
}

jQuery(document).ready(function ($) {
  var windowWidth = $(window).width();

  // Init header offset function
  headerOffset();

  // Update offset on scroll
  $(window).on('scroll resize', function () {
    headerOffset();
  });

  // Update offset on alert bar close
  $('.alert-bar .close--alert').on('click', function () {
    $('.alert-bar').remove();
    headerOffset();
  });
  if (windowWidth > 992) {
    $('.header__inner').on('mouseenter', function (e) {
      // $('.header__bg').fadeIn(300);
      $('.header').addClass('header--white');
    });
    $('.header__inner').on('mouseleave', function (e) {
      // $('.header__bg').fadeOut(300);
      $('.header').removeClass('header--white');
    });
  }

  // $('.header__nav li.top-level').on('mouseleave', function (e) {
  // 	var $this = $(this);

  // 	setTimeout(function () {
  // 		if (!$this.find(':hover').length) {
  // 			$this.find('.sub-menu').fadeOut(300);
  // 			$('.header').removeClass('mega-menu-open');
  // 			$this.removeClass('active');
  // 		}
  // 	}, 75);
  // });

  $('.header__nav li.has-children > a').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    if ($this.closest('li').hasClass('active')) {
      $('.header__nav li').removeClass('active');
      $('.header__nav .sub-menu').fadeOut(170);
      $('.header__bg').fadeOut(170);
      $('.header').removeClass('mega-menu-open');
    } else {
      $('.header__nav li').removeClass('active');
      $('.header__nav .sub-menu').fadeOut(170);
      $this.closest('li').addClass('active');
      $this.closest('li').find('.sub-menu').fadeIn(170);
      $('.header__bg').fadeIn(170);
      $('.header').addClass('mega-menu-open');
    }
  });
  $('.header__bg').on('click', function () {
    $('.header__nav li').removeClass('active');
    $('.header__nav .sub-menu').fadeOut(170);
    $('.header__bg').fadeOut(170);
    $('.header').removeClass('mega-menu-open');
  });

  // Offset content from fixed header
  function headerOffset() {
    var headerHeight = $('.header__inner').innerHeight() + $('.alert-bar').innerHeight();

    // $( '#main' ).css( 'padding-top', headerHeight+'px' );
    $('.pdp__images').css('top', headerHeight + 'px');
    // $('.mobile-menu__inner, .mini-cart').css(
    // 	'max-height',
    // 	'calc( 100vh - ' + headerHeight + 'px )'
    // );

    $(window).on('scroll resize', function () {
      var newsHeight = $('.fixed-wrap .alert-bar').innerHeight();
      if ($(window).scrollTop() >= 350) {
        $('.fixed-wrap').addClass('scrolling');
        if (newsHeight != undefined) {
          $('.fixed-wrap').css('transform', 'translateY(-' + newsHeight + 'px)');
        }
        $('.mobile-menu__inner').css('height', 'calc( 100vh - ' + headerHeight + 'px )');
      } else {
        $('.fixed-wrap').removeClass('scrolling');
        $('.fixed-wrap').css('transform', 'translateY(0)');
      }
    });
  }
});
function closeNav() {
  $('.header__nav li').removeClass('active');
  $('.header__nav .sub-menu').fadeOut(170);
  $('.header__bg').fadeOut(170);
  $('.header').removeClass('mega-menu-open');
}
jQuery(document).ready(function ($) {
  // Close mini cart
  $('.mini-cart__bg, .mini-cart__content .close').on('click', function () {
    closeMini();
  });

  // Show mini cart
  $('.header .icon--cart').on('click', function (e) {
    e.preventDefault();
    if (!$('body').hasClass('template__cart')) {
      showMini();
    } else {
      e.preventDefault();
    }
  });

  // Mini Cart Remove Product
  $('.mini-cart').on('click', '.remove-product', function () {
    var lineNum = $(this).closest('.product').attr('data-lineid');
    $(this).closest('.product').addClass('removed');
    CartJS.removeItem(lineNum, {
      success: function success(data, textStatus, jqXHR) {
        jQuery.getJSON('/cart.js', function (cart) {
          refreshMiniCart(cart);
        });
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  });

  // Mini Cart Upsell ATC
  $('.mini-cart__upsell .action--atc').on('click', function (e) {
    e.preventDefault();
    var dataId = $(this).closest('.upsell').attr('data-id');
    CartJS.addItem(dataId, 1, {}, {
      success: function success(data, textStatus, jqXHR) {
        jQuery.getJSON('/cart.js', function (cart) {
          refreshMiniCart(cart);
        });
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  });

  // Mini Cart Qty
  $('.mini-cart__list').on('click', '.js-qty--mini', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $parent = $this.parent();
    var qtyInput = $parent.find('input');
    var qtyInputVal = qtyInput.val();
    qtyInputVal = $.isNumeric(qtyInputVal) ? qtyInputVal : 0;
    var lineData = $this.closest('.product').data('lineid');
    var lineNum = $('[data-lineID="' + lineData + '"]').index();
    if ($this.hasClass('js-qty--plus')) {
      qtyInputVal++;
      qtyInputVal = qtyInputVal < 0 ? 1 : qtyInputVal;
    } else {
      qtyInputVal--;
      qtyInputVal = qtyInputVal < 1 ? 1 : qtyInputVal;
    }
    CartJS.updateItem(lineNum + 1, qtyInputVal, {}, {
      success: function success(data, textStatus, jqXHR) {
        jQuery.getJSON('/cart.js', function (cart) {
          refreshMiniCart(cart);
        });
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      }
    });
  });

  // Allow typing of input qty for update
  var timer;
  $('.mini-cart__list').on('keyup', '.actions .qty-val', function () {
    var $this = $(this);
    var newVal = $this.val();
    var lineData = $this.closest('.product').data('lineid');

    // clear the previous timer
    clearTimeout(timer);

    // create a new timer with a delay of 300ms seconds,
    // if the keyup is fired before the 300ms secs then the timer will be cleared
    timer = setTimeout(function () {
      // this will be executed if there is a gap of 300ms seconds between 2 keyup events
      CartJS.updateItem(lineData, newVal, {}, {
        success: function success(data, textStatus, jqXHR) {
          jQuery.getJSON('/cart.js', function (cart) {
            refreshMiniCart(cart);
          });
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.log(errorThrown);
        }
      });
    }, 300);
  });
});
function closeMini() {
  $('body').removeClass('cart-open');
  $('.mini-cart').removeClass('is-open');
  $('.mini-cart').fadeOut('fast');
}
function showMini() {
  $('body').addClass('cart-open');
  $('.mini-cart').fadeIn('fast');
  $('.mini-cart').addClass('is-open');

  // Set height of product list for full-height mini-cart
  // var miniHead = parseInt( $( '.mini-cart__header' ).innerHeight() );
  // var miniShip = parseInt( $( '.mini-cart__ship' ).innerHeight() );
  // var miniFooter = parseInt( $( '.mini-cart__footer' ).innerHeight() );
  // var miniUp = parseInt( $( '.mini-cart__upsell' ).innerHeight() );
  // var miniTotalHeight = miniHead + miniShip + miniFooter + miniUp;
}
function refreshMiniCart(cartData) {
  var cartItems = cartData.items;
  var newCartHtml = '';

  // Free shipping updater
  var totalShip = parseInt($('.mini-cart').data('freeship'));
  var newCartTotal = cartData.items_subtotal_price;
  var awayShip = totalShip - newCartTotal;
  var shipPercent = newCartTotal / totalShip * 100;
  if (shipPercent >= 100) {
    $('.shipping-bar--progress').css('width', '100%');
    $('.mini-cart__ship').addClass('is-free');
  } else {
    if ($('.mini-cart__ship').hasClass('is-free')) {
      $('.mini-cart__ship').removeClass('is-free');
    }
    $('.free-count').text(formatter.format(awayShip / 100));
    $('.shipping-bar--progress').css('width', shipPercent + '%');
  }

  // If cart is now empty
  if (cartData.item_count == 0) {
    newCartHtml += ' <h3 class="text-center">Cart is empty</h3>';
    $('.mini-cart__actions').hide();
  } else {
    $('.mini-cart__actions').show();
    $('.mini-cart__header h2 span').text('[' + cartData.item_count + ']');
    // Build html of new products in cart
    $.each(cartItems, function (index, item) {
      // Opening
      newCartHtml += '<div class="product product--cart d-flex justify-between" data-lineid="' + (index + 1) + '">';
      newCartHtml += ' <div class="product__image">';
      if (item.featured_image) {
        newCartHtml += '<a href="' + item.url + '">';
        newCartHtml += '<img src="' + item.featured_image.url.replace('.jpg', '_80x.jpg').replace('.png', '_80x.png') + '" srcset="' + item.featured_image.url.replace('.jpg', '_160x.jpg').replace('.png', '_160x.png') + ' 2x" alt="' + item.image.alt + '">';
        newCartHtml += '</a>';
      }
      newCartHtml += '</div>';
      newCartHtml += '<div class="product__info">';
      newCartHtml += '<div class="upper d-flex justify-between">';
      newCartHtml += '<div class="title d-flex">';
      newCartHtml += '<h3 class="heading--four d-flex justify-between">';
      newCartHtml += '<a class="no-dec trans" href="' + item.url + '">';
      newCartHtml += item.product_title;
      newCartHtml += '</a>';
      newCartHtml += '</h3>';
      if (item.variant_title) {
        newCartHtml += '<div class="var">';
        newCartHtml += item.variant_title;
        newCartHtml += '</div>';
      }
      if (item.sku) {
        newCartHtml += '<div class="sku">';
        newCartHtml += item.sku;
        newCartHtml += '</div>';
      }
      if (item.discounts) {
        item.discounts.forEach(function (discount) {
          newCartHtml += "<span class=\"cart-item-discount d-flex align-center\">\n          <img src=\"//www.jumpsport.com/cdn/shop/t/21/assets/icon-discount.svg?v=43768739189281880191759265416\" /><span>\n          ".concat(discount.title, " (-").concat(formatter.format(discount.amount / 100), ")</span></span>");
        });
      }
      if (item.hasOwnProperty('selling_plan_allocation')) {
        newCartHtml += '<span class="delivery">' + item.selling_plan_allocation.selling_plan.name + '</span>';
      }
      newCartHtml += '<span class="unit-price">' + formatter.format(item.price / 100) + '</span>';
      newCartHtml += '</div>';
      newCartHtml += '<div class="price">' + formatter.format(item.final_line_price / 100) + '</div>';
      newCartHtml += '</div>';
      // newCartHtml += '<div class="price">'+formatter.format(item.final_line_price / 100)+'</div>';
      newCartHtml += "<div class=\"actions d-flex align-center justify-between\">\n\t\t\t\t\t\t<div class=\"action action--qty\">\n\t\t\t\t\t\t\t<div class=\"qty d-flex align-center\">\n\t\t\t\t\t\t\t\t<button class=\"js-qty js-qty--mini js-qty--minus trans\">\n\t\t\t\t\t\t\t\t\t<span class=\"sr-only\">Decrease</span>\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t\t<input sm-rc-quantity-selector type=\"text\" value=\"" + item.quantity + "\" min=\"1\"  type=\"number\" class=\"qty-val\" />\n\t\t\t\t\t\t\t\t<button class=\"js-qty js-qty--mini js-qty--plus trans\">\n\t\t\t\t\t\t\t\t\t<span class=\"sr-only\">Increase</span>\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t</div>\n            \n\t\t\t\t\t\t</div>\n            <button class=\"remove-product trans\">Remove</button>\n            ";
      newCartHtml += '</div>';

      // Closing
      newCartHtml += '</div>';
      newCartHtml += '</div>';
    });
  }

  // Clear current products in cart
  $('.mini-cart__items').empty();

  // Set new subtotal
  $('.mini-cart__footer .sub-total .total').text(formatter.format(cartData.total_price / 100));

  // Set new header icon count
  if (cartData.item_count == 0) {
    $('.icon--cart .cart-count').hide();
  } else {
    $('.icon--cart .cart-count span').text(cartData.item_count);
    $('.icon--cart .cart-count').show();
  }

  // Add updated producst to mini cart
  $('.mini-cart__list').html(newCartHtml);

  // Show mini cart
  showMini();
}
jQuery(document).ready(function ($) {
  /******************************************
     Options to change SM-RC Widget dropdowns
    ******************************************/

  // SELECT TYPE
  $('.option__wrap select').on('change', function () {
    var optionVal = $(this).val();
    var optionNum = $(this).closest('.option__wrap').attr('data-option');
    $('select[' + optionNum + ']').val(optionVal).change();
  });

  // BUTTON TYPE
  $('.option__wrap button').on('click', function (e) {
    var optionVal = $(this).attr('data-val');
    var optionNum = $(this).closest('.option__wrap').attr('data-option');

    // Set visual display of active
    $(this).closest('.option__wrap').find('button').removeClass('active');
    $(this).addClass('active');
    $('.option-select--' + optionNum).val(optionVal).change();
  });

  // Addons active state
  $('.addon input').on('click', function () {
    $(this).closest('label').toggleClass('active');
  });
});
jQuery(document).ready(function ($) {
  $('.section-block').each(function () {
    if ($(this).find('.arch-wrap--bottom').length) {
      $(this).closest('.shopify-section').next('.shopify-section').find('.section-block').addClass('arch-padding--bottom');
      $(this).addClass('has-arch has-arch--bottom');
    }
    if ($(this).find('.arch-wrap--top').length) {
      $(this).closest('.shopify-section').prev('.shopify-section').find('.section-block').addClass('arch-padding--top');
      $(this).addClass('has-arch has-arch--top');
    }
  });
});
jQuery(document).ready(function ($) {});
// Sleepify Starter Theme by Sleepless Media
//
// Main Javascript entry file.

console.log('%c This site was designed & developed by https://www.sleeplessmedia.com', 'background:#000; color: #ae956e; padding: 10px 15px; font-size: 13px; font-weight: 500; width: 100%;');

// Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

// Cookies functions
function setCookie(cookieName, cookieValue) {
  var today = new Date();
  var expire = new Date();
  expire.setTime(today.getTime() + 3600000 * 24 * 7);
  document.cookie = cookieName + '=' + encodeURI(cookieValue) + ';expires=' + expire.toGMTString();
}
function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}