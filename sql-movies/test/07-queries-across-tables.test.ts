import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("06", "07");
  }, minutes(10));

  it(
    "should select top three directors ordered by total budget spent in their movies",
    async done => {
      const query = `SELECT
      round(SUM(budget_adjusted),2) as total_budget,
      directors.full_name as director
      FROM movies
      JOIN movie_directors on movies.id=movie_directors.movie_id
      JOIN directors on directors.id=movie_directors.director_id
      GROUP by directors.full_name
      ORDER by total_budget DESC
      LIMIT 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          director: "Ridley Scott",
          total_budget: 722882143.58
        },
        {
          director: "Michael Bay",
          total_budget: 518297522.1
        },
        {
          director: "David Yates",
          total_budget: 504100108.5
        }
      ]);

      done();
    },
    minutes(10)
  );

  it(
    "should select top 10 keywords ordered by their appearance in movies",
    async done => {
      const query = `SELECT
      keyword, count(movie_keywords.keyword_id) as count
      FROM keywords
      JOIN movie_keywords on keywords.id=movie_keywords.keyword_id
      GROUP by keyword_id
      ORDER by count DESC 
      LIMIT 10`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          keyword: "woman director",
          count: 162
        },
        {
          keyword: "independent film",
          count: 115
        },
        {
          keyword: "based on novel",
          count: 85
        },
        {
          keyword: "duringcreditsstinger",
          count: 82
        },
        {
          keyword: "biography",
          count: 78
        },
        {
          keyword: "murder",
          count: 66
        },
        {
          keyword: "sex",
          count: 60
        },
        {
          keyword: "revenge",
          count: 51
        },
        {
          keyword: "sport",
          count: 50
        },
        {
          keyword: "high school",
          count: 48
        }
      ]);

      done();
    },
    minutes(10)
  );

  it(
    "should select one movie which has highest count of actors",
    async done => {
      const query = `SELECT 
      original_title, count(movie_actors.actor_id) as count
      FROM movies
      JOIN movie_actors on movies.id=movie_actors.movie_id
      GROUP by original_title
      ORDER by count DESC 
      LIMIT 1`;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        original_title: "Life",
        count: 12
      });

      done();
    },
    minutes(10)
  );
  
  it(
    "should select three genres which has most ratings with 5 stars",
    async done => {
      const query = `SELECT 
      genre, count(genre) as five_stars_count
      FROM genres
      JOIN movie_genreSs on movie_genres.genre_id=genres.id
      JOIN movie_ratings on movie_ratings.movie_id=movie_genres.movie_id
      WHERE movie_ratings.rating = 5
      GROUP by genre
      ORDER by five_stars_count DESC 
      LIMIT 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Drama",
          five_stars_count: 15052
        },
        {
          genre: "Thriller",
          five_stars_count: 11771
        },
        {
          genre: "Crime",
          five_stars_count: 8670
        }
      ]);

      done();
    },
    minutes(10)
  );

  it(
    "should select top three genres ordered by average rating",
    async done => {
      const query = `SELECT genre, round(avg(movie_ratings.rating), 2) as avg_rating
      FROM genres
      JOIN movie_genres on movie_genres.genre_id = genre_id
      JOIN movie_ratings on movie_ratings.movie_id = movie_genres.movie_id
      GROUP by genre
      ORDER by avg_rating DESC
      LIMIT 3`;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Crime",
          avg_rating: 3.79
        },
        {
          genre: "Music",
          avg_rating: 3.73
        },
        {
          genre: "Documentary",
          avg_rating: 3.71
        }
      ]);

      done();
    },
    minutes(10)
  );
});
