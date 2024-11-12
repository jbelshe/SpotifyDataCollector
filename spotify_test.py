import spotipy, json
from spotipy.oauth2 import SpotifyClientCredentials

def create_object(track):
    song_name = track['name']
    song_id = track['id']
    album_name = track['album']['name']
    artists = []
    artists_id = []
    for art in track['artists']:
        artists.append(art['name'])
        artists_id.append(art['id'])
    release_date = track['album']['release_date']
    return {
        'song': song_name,
        'song_id': song_id,
        'album': album_name,
        'artists': artists,
        'artists_id': artists_id,
        'release_date': release_date
    }


def create_object_by_item(song_name, album_name, artists, release_date):
    return {
        'song': song_name,
        'album': album_name,
        'artists': artists,
        'release_date': release_date
    }

# Set up authentication credentials
client_id = '7b6140764d8e4dc5ba6aeaf90ecb35a7'  # Replace with your Client ID
client_secret = 'bbcad5103efc40d3ab988b01305fe0a3'  # Replace with your Client Secret

# Authentication flow
auth_manager = SpotifyClientCredentials(client_id=client_id, client_secret=client_secret)
sp = spotipy.Spotify(auth_manager=auth_manager)


playlist_id = '6uRb2P6XRj5ygnanxpMCfS' #'1G8IpkZKobrIlXcVPoSIuf'
playlist = sp.playlist(playlist_id)

tracks = playlist['tracks']


count = 0

data = []
songs_arr = tracks['items']
for song in songs_arr:
    data.append(create_object(song['track']))
tracks = sp.next(tracks)
while tracks['next'] is not None:
    songs_arr = tracks['items']
    for song in songs_arr:
        try:
            data.append(create_object(song['track']))
        except Exception as e:
            print("ERROR:", song['track'])
            print(e)
    print("MORE TO COME", count)
    count += 1
    tracks = sp.next(tracks)

print(data)
with open('data.json', 'w') as outfile:
    json.dump(data, outfile, indent=4)