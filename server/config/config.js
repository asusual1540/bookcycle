module.exports = {
    "mongoURI": "mongodb://adnan:adnan1540@ds141813.mlab.com:41813/bookcycle",
    "secretKey": "Iamkira1540",
    'facebookAuth': {
        'clientID': '', // your App ID
        'clientSecret': '', // your App Secret
        'callbackURL': '/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields': ['id', 'email', 'name', 'picture.type(large)'] // For requesting permissions from Facebook API
    },
    'googleAuth': {
        'clientID': '',
        'clientSecret': '',
        'callbackURL': '/auth/google/callback'
    }
}