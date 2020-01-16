Rails.application.routes.draw do
  root to: 'application#home'
  devise_for :users

  scope :api do 
    resources :todo_items, only: [:index, :create, :update, :destroy] do 
      post :complete
    end
  end
end
