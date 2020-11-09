## Table 정리

### 1) movie : type == "MOVIE",

- show_id(key) : int(8자리), type(Movie or TV Show) : str, title : str, release_year : int, rating : str, month : str, date : int, year : int
### 2) tv_show : type == "TV Show",

- show_id(key) : int(8자리), type(Movie or TV Show) : str, title : str, release_year : int, rating : str, month : str, date : int, year : int 
### 3) country

- title(key) : str, country : str
### 4) direc

- title(key) : str, director : str

## Table Size

- movie1 : (1535, 9)
- movie2 : (1706, 9)
- movie3 : (1024, 9)
- tv_show1 : (787, 9)
- tv_show2 : (1182, 9)
- country1 : (2273, 2)
- country2 : (3182, 2)
- country3 : (2122, 2)
- direc1 : (2702, 2)
- direc2 : (4053, 2)