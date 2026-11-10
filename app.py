from flask import Flask, render_template, request, flash, redirect, url_for

app = Flask(__name__)
app.secret_key = "change-this-to-something-random"

PROJECTS = [
    {"title": "Task Manager", "desc": "CRUD app with Flask and SQLite.", "link": "#"},
    {"title": "Weather App", "desc": "Live weather using a REST API.", "link": "#"},
    {"title": "Data Analysis", "desc": "Insights from a real dataset.", "link": "#"},
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
        flash("Thanks! Your message was received.")
        return redirect(url_for("contact"))
    return render_template("contact.html")

if __name__ == "__main__":
    app.run(debug=True)