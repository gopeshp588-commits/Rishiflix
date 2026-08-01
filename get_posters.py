import urllib.request
import urllib.parse
import json
import re

movies = [
    "Jawan", "RRR", "Animal", "Dunki", "Baahubali 2", "Pathaan", "Dangal", "3 Idiots", "Kantara", "KGF Chapter 2",
    "Extraction", "Glass Onion", "Red Notice", "The Gray Man", "Don't Look Up", "The Irishman", "Enola Holmes", "Bird Box", "The Adam Project", "Leave the World Behind"
]

for movie in movies:
    query = urllib.parse.quote(movie)
    url = f"https://api.themoviedb.org/3/search/movie?api_key=15d2ea6d0dc1d476efbca3eba2b9bbfb&query={query}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            if data['results']:
                poster = data['results'][0].get('poster_path')
                if poster:
                    print(f"\"{movie}\": \"https://image.tmdb.org/t/p/w500{poster}\",")
                else:
                    print(f"\"{movie}\": \"No poster found\",")
            else:
                print(f"\"{movie}\": \"No results\",")
    except Exception as e:
        print(f"Error for {movie}: {e}")
