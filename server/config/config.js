module.exports = {
    "mongoURI": "mongodb://adnan:adnan1540@ds141813.mlab.com:41813/bookcycle",
    "secretKey": "Iamkira1540",
    'facebookAuth': {
        'clientID': '2113469788922621', // your App ID
        'clientSecret': 'b0481c6222414679e87988a85193f843', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields': ['id', 'email', 'name', 'photos'] // For requesting permissions from Facebook API

    },
    'googleAuth': {
        'clientID': '173867288656-dhohd4plhrr4tu8ne79mb9fqmj3ejsiq.apps.googleusercontent.com',
        'clientSecret': 'BEy-OHR9Ee9k2Wfd1TUwX8O8',
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    }
}