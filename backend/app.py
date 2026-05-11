from flask import Flask, request
from flask_cors import CORS

from supabase_client import supabase


app = Flask(__name__)

CORS(app)


# HOME ROUTE
@app.route("/")
def home():

    return {
        "message": "Supabase connected successfully"
    }


# GET ALL TREES
@app.route("/trees", methods=["GET"])
def get_trees():

    try:

        response = (
            supabase
            .table("trees")
            .select("*")
            .order("id")
            .execute()
        )

        return response.data

    except Exception as error:

        return {
            "error": str(error)
        }, 500


# SAVE NEW TREE
@app.route("/trees", methods=["POST"])
def save_tree():

    try:

        data = request.json

        response = (
            supabase
            .table("trees")
            .insert({
                "tree_data": data
            })
            .execute()
        )

        return {
            "message": "Tree saved successfully",
            "data": response.data
        }

    except Exception as error:

        return {
            "error": str(error)
        }, 500


# UPDATE EXISTING TREE
@app.route("/trees/<int:tree_id>", methods=["PUT"])
def update_tree(tree_id):

    try:

        data = request.json

        response = (
            supabase
            .table("trees")
            .update({
                "tree_data": data
            })
            .eq("id", tree_id)
            .execute()
        )

        return {
            "message": "Tree updated successfully",
            "data": response.data
        }

    except Exception as error:

        return {
            "error": str(error)
        }, 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)