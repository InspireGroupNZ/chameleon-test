class ApplicationService
  def self.call(*args, &block)
    new(*args, &block).call
  end
end

class TestKlass < ApplicationService
  def initialize(predicate)
    @predicate = predicate
  end
  
  def call
    "Hello, #{@predicate}"
  end
end

puts TestKlass.call("world")