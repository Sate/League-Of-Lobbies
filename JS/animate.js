// CSS3 animate function made by me, using keyframe animations from Dan Eden. Fatal param indicates elem will be destroyed, thus we want to prevent settimeout calls. 


var animate = function(element,effect,duration, fatal){
    var timeOut = 1500;
    element.show();
    element.removeClass('hide');
    if (duration){
      var durObj = {  
        '-webkit-animation-duration': duration+ 's',
        '-moz-animation-duration': duration+ 's',
        '-ms-animation-duration': duration+ 's',
        '-o-animation-duration': duration+ 's',
        'animation-duration': duration+ 's'}
      element.css(durObj);
      timeOut = duration*1000+50;
      if(fatal !== "fatal"){
        setTimeout(function(){
          element.removeAttr("style");
        }, timeOut);
      }
    }
    element.addClass('animated ' +effect);
    if (fatal !== "fatal"){
      setTimeout(function(){
        element.removeClass(effect+' animated');
      }, timeOut);
    }

  }