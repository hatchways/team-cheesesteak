from app import db

class Profile(db.Model):
    __tablename__ = 'profile'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    image = db.Column(db.Text)
    price = db.Column(db.Float(precision=2), nullable=False)
    ingredients = db.Column(db.String(200), nullable=True)
    portion = db.Column(db.Integer, nullable=False)
    required_tools = db.Column(db.String(200), nullable=True)
    user = db.relationship("User", back_populates="profile")
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __init__(self, name, image, price, ingredients, portion, required_tools, user_id):
        self.name = name
        self.image = image
        self.price = price
        self.ingredients = ingredients
        self.portion = portion
        self.required_tools = required_tools
        self.user_id = user_id

    def __repr__(self):
        return f"<Profile #{self.id}: {self.name}>"

    
        
