(function($){

var authenticated=false;
var myRoom = null;
var socket = null; 


// the function to show the queue modal
var showinfo= function(){
	$('#modal2').modal('show');
	animate('#userslist', 'bounceInRight');
	$('#modal2 .modal-body').prepend('Welcome '+userinfo.username+' you are in queue to play '+userinfo.lane+'<br/>');
	setTimeout(function(){$('input.chatinput').focus();}, 200);
}
// need connect in a function so socket can be defined before executing socket bindings
var connect = function(){
	socket = io.connect(window.location.hostname, {
		reconnect:false
	});
	socketBindings();
};


var socketBindings = function(){
// initial validation, joining default queue chat
	socket.on('userinfoValid', function(data){
		authenticated = true;
		userinfo = data;
		console.log('hi');
		console.log(userinfo);
		$('#modal1').modal('hide');
		showinfo();
		myRoom = 'queue';
	});

	socket.on('messageServed', function(data){
		console.log('hi');
		var laneDict = {
			"sup": "Support",
			"adc": "AD Carry",
			"top": "Solo Top",
			"mid": "Solo Mid",
			"jun": "Jungle"
		}
		data.player.lane = laneDict[data.player.lane];
		// if(data.player.lane == 'sup'){data.player.lane = 'Support'};
  //   if(data.player.lane == 'adc'){data.player.lane = 'AD Carry'};
  //   if(data.player.lane == 'top'){data.player.lane = 'Solo Top'};
  //   if(data.player.lane == 'mid'){data.player.lane = 'Solo Mid'};
  //   if(data.player.lane == 'jun'){data.player.lane = 'Jungle'};
		var username = data.player.username;
		var userlane = data.player.lane;
		var message = data.message;
		$('#modal2 .modal-body').append('<b>'+username+' ('+userlane+')</b>: '+message+'<br/>');
		$("#modal2 .modal-body").scrollTop($("#modal2 .modal-body")[0].scrollHeight);

	});

	socket.on('updateUserList', function(data){
		console.log(data);
		$('#roomInfo').html('ROOM: '+ myRoom + '<br/>ME: '+ userinfo.username);
		$('#usersInner').html('');
		for (var i in data.users){
			$('#usersInner').append(
				"<span id=''>"+
				data.users[i].username + '('+data.users[i].lane + ')'
				+ '<br/></span>');
		}
		animate('#usersInner', 'fadeIn');
	});

	socket.on('updateStatus', function(data){
		//checks to see if user with same id is already on screen, to avoid duplicates
		if (data.status === 'online' && ($('#'+data.player.sid).length == 0)   ){
			console.log(data);
			$('#usersInner').append(
				"<span id='"+data.player.sid+"'>"+
				data.player.username 
				+ '<br/></span>');
		}
		if (data.status === 'offline'){
			$('span#'+data.player.sid).fadeToggle();
			$('span#'+data.player.sid).remove();

		}
		animate('#'+data.player.sid,'fadeInUp')
	});

	socket.on('newRoom', function(data){
		myRoom = data;
		console.log(myRoom+'HEYHEY');
	});



};

var messageSender = function(){
	var input = $('.chatinput').val().trim();
	if (input){
		socket.emit('messageSent', { input: input, room: myRoom } );
		$('.chatinput').val('');
	}

};

// animation function to make use of animate.css
var animate = function(element,effect){
		$(element).show();
		$(element).addClass('animated ' +effect);
		setTimeout(function(){
			$(element).removeClass(effect);
		}, 1500);
}




var DOMBindings = function(){
		//Choosing a lane initiates connection and starts everything
		$('.lanechooser a').on('click',function(e){
			e.preventDefault();
			// Alert if username is empty
			if($('#username').val().trim() == ''){
				animate('#username', 'swing shake wobble');
				// animate('#modal1', 'tada');				
				$('#error').html("<div class='alert'>You need a username!</div>");	
				$('#error').slideDown();
				animate('#error', 'bounceInDown');
				$('#username').focus();
			}else{
				if (authenticated !== true){
					connect();
					var chosenLane= 'lane='+$(this).data('lane')+'&username='+$('#username').val();
					var userinfo = {lane: $(this).data('lane'),
												username: $('#username').val().trim() };
					socket.emit('laneSelected', userinfo);
					$('#modal1 .modal-body').html('Joining please wait...');

					}
			}
		});

		$('.chatinput').on('keydown', function(e){
			var key = e.which;
			if(key == 13){
				messageSender();
			}
		});
};
	
// handler to start queue chooser when person types in name and chooses

	// on page load, initital modal
	$(function(){
		DOMBindings();
	});

	setTimeout(function(){
		$('#modal1').modal('show');
		$('#username').focus();
		},300);
	setTimeout(function(){
		$('#username').focus();
		},500);

})(jQuery);