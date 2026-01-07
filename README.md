To run the HTML website:
- Ensure that Python 3.x is installed in your IDE.
- In the terminal of your IDE run: python3 -m http.server (or your own python version)
- In your browser go to: http://localhost:8000/RiskyRun.html (tested in Google Chrome)
- Or: http-server and http://localhost:8080/RiskyRun.html

Depending on the size of your screen, the layout might not properly work (don't hate, I'm doing this for fun). Putting your screen full screen might help (F11).

Game explanation:
The goal is to score as many points as possible by capturing as much areas as possible. To claim an area, you have to go to the area and complete a challenge. 
However, one of the players can not claim areas. He can only claim areas after he tags another player. The player he tagged will then become it, and can not claim any areas. The person who is it permanently has the locations of all players, while the other players don’t know anyones location.
The first time an area is claimed it is worth 3 points, the second time it is claimed, it is worth 2 points, from then on the area is worth 1 point upon claiming. Every area starts of being worth 3 points.

How to use the website:
- The 'Scorebord' menu displays the current score of a player and how many areas they have claimed.
- The 'Selecteer een speler' menu enables the user to select a different player. The menu can be expanded and retracted (by default it is retracted.)
- The 'Puntenwaarde gebieden' menu enables the user to change the points value of an area. The menu can be expanded and retracted (by default it is retracted.)
- The small 'Zet website beweging uit' checkbox enables to user to lock any website movements. The game interactivity is still present, but the map and website won't change in size/proportions.
- The small 'Verberg gebied waarde labels' removes the area number labels from the map.
- Each area contains two labels. The white label displays the area number. The black label displays the points value of an area. If the points value has decreased after the user clicked the area, the current points value is displayed with the old points value (the number of points which are subtracted from the player who currently has the area if a new player claims the area) behind it in brackets.
- When the user enters an area, the change in score will be displayed in brackets and grey text behind the current scores.
- When the user clicks on an area, the area will be claimed by the selected player. The score and points area value will be updated accordingly.
- Every time the user clicks an area, the area points decrease by 1, with a minimum value of 1. After this the area does not need any changes in points value.

Known bugs:
- When hovering your mouse over 'Scorebord' it looks like it's clickable. It is not, the mouse icon is going to be changed.

Functionality to add:
- Better visualisation of what an area is called.
- Disable interactivity of points value label.
- Add pop-up window with the name of the area when hovering over an area.
- Add the area number behind the area name in the 'Puntenwaarde gebieden' menu.
