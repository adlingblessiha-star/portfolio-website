from flask import Flask, render_template, request, flash, redirect, url_for

app = Flask(__name__)
app.secret_key = "change-this-to-something-random"

# Edit these! "emoji" becomes the sticker on each card.
PROJECTS = [
    {"title": "Task Manager", "emoji": "📝", "desc": "A CRUD app with Flask and SQLite to plan your day.",
     "link": "#", "tags": ["Flask", "SQLite"]},
    {"title": "Weather App", "emoji": "🌤️", "desc": "Live weather for any city using a REST API.",
     "link": "#", "tags": ["API", "Python"]},
    {"title": "Data Analysis", "emoji": "📊", "desc": "Finding insights in a real dataset with Pandas.",
     "link": "#", "tags": ["Pandas", "Matplotlib"]},
]

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/projects")
def projects():
    return render_template("projects.html", projects=PROJECTS)

@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        message = request.form.get("message")
        print(f"Message from {name}: {message}")
        flash("Thank you! Your message was received 💌")
        return redirect(url_for("contact"))
    return render_template("contact.html")

if __name__ == "__main__":
    app.run(debug=True)
