from flask import Flask, render_template, request
import random

app = Flask(__name__)

def determine_winner(player_choice, computer_choice):
    if player_choice == computer_choice:
        return "It's a tie!"
    elif player_choice == "rock":
        return "Player wins!" if computer_choice == "scissors" else "Computer wins!"
    elif player_choice == "paper":
        return "Player wins!" if computer_choice == "rock" else "Computer wins!"
    elif player_choice == "scissors":
        return "Player wins!" if computer_choice == "paper" else "Computer wins!"
    else:
        return "Invalid choice. Please choose 'rock', 'paper', or 'scissors'."

@app.route("/", methods=["GET", "POST"])
def play_game():
    if request.method == "POST":
        player_choice = request.form["player_choice"].lower().strip()
        options = ["rock", "paper", "scissors"]
        computer_choice = random.choice(options)

        result = determine_winner(player_choice, computer_choice)
        return render_template("result.html", player_choice=player_choice, computer_choice=computer_choice, result=result)

    return render_template("index.html")

if __name__ == "__main__":
    app.run()

