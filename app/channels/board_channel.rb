class BoardChannel < ApplicationCable::Channel
  def subscribed
    stream_from "board"
  end

  def unsubscribed
    stop.all_streams
  end
end
