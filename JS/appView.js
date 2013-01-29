var AppView = Backbone.View.extend({

  el : ".container.main",

  initialize: function(){
    chooser = new chooserView({model: new Backbone.Model});
    counterV = new counterView({model: new counterModel()});
    counterV.$el.appendTo($('.modal-header'));
    roomList = new roomListView({collection: new roomListCollection()});
  },

  events: {
    "keydown input.chatinput" : "sendMessage",
    "click #fontToggle" : "toggleFont",
    "click #requeue" : 'requeue'
  },

  toggleFont: function(e){
    e.preventDefault();
    this.$('.chatinput').toggleClass('brush');
    this.$('.chatText').toggleClass('brush');
  },

  requeue: function(e){
    e.preventDefault();
    socket.emit('requeue');
  },  

  handleMessage: function(data){
    var laneDict = counterV.dictionary;
    if (data.player.lane){
    data.player.lane = laneDict[data.player.lane];
    }
    var username = data.player.username;
    var userlane = data.player.lane;
    var message = data.message;
    var chatBox = data.room === 'global' ? $('#gChatArea') : $('.chatText') ;
    chatBox.append('<b>'+username+' ('+userlane+')</b>: '+message+'<br/>');
    chatBox.scrollTop(chatBox[0].scrollHeight);
  },

  sendMessage: function(e){
    var room = $(e.currentTarget).hasClass('global') ? 'global' : chooser.model.get("myRoom");
    var input = $(e.currentTarget).val().trim();
    if (e.which!==13 || input == "") return;
    socket.emit('messageSent', { input: input, room: room } );
    $(e.currentTarget).val('');  
  },

  submitEnter : function(e){
    if (e.which === 13 ) {
      this.model.set({"text" : this.$input.val()});
      this.$input.addClass('hide');
      this.$('span').removeClass('hide');
      }
  },

  connect: function(e){
    e.preventDefault();
    if($('#username').val().trim() == ''){
      animate($('#username'), 'swing shake wobble', 1);
      $('#error').html("<div class='alert'>You need a username!</div>");  
      animate($('#error'), 'bounceInDown');
      $('#username').focus();
    }else{
      if (this.authenticated !== true){
        socket = io.connect(window.location.hostname, {
          reconnect:false
        });
        socketBindings();
        var userinfo = {lane: $(e.currentTarget).data('lane'),
                      username: $('#username').val().trim() };
        socket.emit('laneSelected', userinfo);
        chooser.$('.modal-body').html('Joining please wait...');
      }
    }
  },

  showChat: function(){
    var delay = 0;
    if ($('#chatbox.hide').length === 0){
      animate(this.$('#chatbox'), 'bounceOutLeft', 0.3)
      delay = 300;
    }
    setTimeout(function(){
    counterV.$el.appendTo($('h1'));
    animate(counterV.$el, 'bounceInLeft', 0.7);
    animate(this.$('#chatbox'), 'bounceInRight', 0.7);
    }, delay);
    setTimeout(function(){
    this.$('input.chatinput:not(.global)').focus();
    animate(roomList.$el, 'fadeIn');
    }, 600+delay);
  },

  showGlobalChat: function(){
    animate($('#globalChat'), 'fadeIn', 0.5);
  }

      

});