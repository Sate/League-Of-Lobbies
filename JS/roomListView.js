var roomListView = Backbone.View.extend({

  el: '#userslist',

  initialize: function(){
    this.listenTo(this.collection, "reset", this.render)
    this.listenTo(this.collection, "add", this.renderNew)
  },

  events: {
    'click .copy': 'copyToClipboard'

  },


  copyToClipboard: function(e) {
    e.preventDefault();
    var text = $(e.currentTarget).data("name");
    window.prompt ("Copy to clipboard: Ctrl+C, Enter", text);
  },

  resetRoom: function(newData){
    this.collection.reset(newData);
  },

  renderNew: function(){
    var player = this.collection.last();
    this.$('#usersInner').append("<div class='"+ player.get("uid")+"'>"+player.get("username")+': '+counterV.dictionary[player.get("lane")]+"<a data-name='"+player.get("username")+"' class='copy' href='#'> Copy</a></div>")
    animate($('.'+player.get("uid")), 'flipInY', 0.5);
  },

  render: function(){
    this.$('#roomInfo').html("You are in room: "+ chooser.model.get("myRoom"));
    this.$("#usersInner").html('');
    this.collection.each(function(player){
      this.$('#usersInner').append(
        "<div class='"+ player.get("uid")+"'>"+player.get("username")+': '+counterV.dictionary[player.get("lane")]+"<a data-name='"+player.get("username")+"' class='copy' href='#'> Copy</a></div>")
    });
    animate($('#usersInner'), 'fadeIn');
  },

  updateStatus: function(data){
    var found = this.collection.filter(function(obj){return obj.get('uid') === data.player.uid})[0];
    if (data.status === 'online'){
      if (!found){
        this.collection.add(data.player);
      } else {
        for (var i in data){ found.set(i, data[i]) }
      }
    } else if (data.status === 'offline'){
      animate($('div.'+found.get('uid')), 'flipOutY', 0.5, 'fatal');
      found.destroy();
    }

  }

});








