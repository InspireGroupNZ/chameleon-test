Rails.application.routes.draw do
  # root to: 'application#home'
  root to: 'todo_items#index'
  devise_for :users

  # All Rails Routes for TodoItems
  resources :todo_items

  # scope :api do 
  #   resources :todo_items, only: [:index, :create, :update, :destroy] do 
  #     post :complete
  #   end
  # end
end
