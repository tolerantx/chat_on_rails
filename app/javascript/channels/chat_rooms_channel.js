import consumer from "./consumer"

jQuery(document).on('turbolinks:load', function() {
  var messages = $('#messages')

  if ($('#messages').length > 0) {
    function messages_to_bottom() {
      messages.scrollTop(messages.prop('scrollHeight'))
    }
    messages_to_bottom();

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
