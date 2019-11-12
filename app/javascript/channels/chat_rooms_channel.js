import consumer from "./consumer"

jQuery(document).on('turbolinks:load', function() {
  var messages = $('#messages')

  if ($('#messages .media').length > 0) {
    function messages_to_bottom() {
      var scroller = messages.parent();
      scroller.scrollTop(scroller.prop('scrollHeight'));
    }

    var setScroller = setInterval(function() {
      messages_to_bottom()
      document.getElementById('message_body').focus();

      if (setScroller) {
       window.clearInterval(setScroller);
      }
    }, 1000);

    consumer.global_chat = consumer.subscriptions.create(
      {
        channel: "ChatRoomsChannel",
        chat_room_id: messages.data('chat-room-id')
      },
      {
        received(data) {
          messages.append(data['message'])
          messages_to_bottom();
        },

        send_message(message, chat_room_id) {
          this.perform(
            'send_message',
            { message: message, chat_room_id: chat_room_id }
          )
        }
      }
    )

    $('#new_message').submit(function(e) {
      e.preventDefault();
      var $this = $(this);
      var textarea = $this.find('#message_body');

      if ($.trim(textarea.val()).length > 1) {
        consumer.global_chat.send_message(
          textarea.val(),
          messages.data('chat-room-id')
        );
        textarea.val('');
      }
      return false
    })

  }
})
