Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  devise_for :users

  resources :chat_rooms, only: [:new, :create, :show, :index]
  root 'chat_rooms#index'

  mount ActionCable.server => '/cable'
end
