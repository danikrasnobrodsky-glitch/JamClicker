using System;
using System.Linq;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Project.DatabaseUtilities;
using Project.LoggingUtilities;
using Project.ServerUtilities;

class Program
{
  static void Main()
  {
    int port = 5000;

    var server = new Server(port);
    var database = new Database();

    Console.WriteLine("The server is running");
    Console.WriteLine($"Local:   http://localhost:{port}/website/pages/FirstPage.html");
    Console.WriteLine($"Network: http://{Network.GetLocalNetworkIPAddress()}:{port}/website/pages/FirstPage.html");

    while (true)
    {
      var request = server.WaitForRequest();

      Console.WriteLine($"Received a request: {request.Name}");

      try
      {
        if (request.Name == "Login")
        {
          var (username, password) = request.GetParams<(string, string)>();

          var user = database.Users.FirstOrDefault(u => u.Username == username && u.Password == password);

          request.Respond(user?.UserToken);
        }

        else if (request.Name == "Signup")
        {
          var (username, password) = request.GetParams<(string, string)>();

          if (database.Users.Any(u => u.Username == username))
          {
            request.Respond((string?)null);
            continue;
          }

          var token = Guid.NewGuid().ToString();
          var user = new User(username, password, token);

          database.Users.Add(user);
          database.SaveChanges();

          request.Respond(token);
        }

        else if (request.Name == "addScore")
        {
          var (token, score) = request.GetParams<(string, int)>();
          var user = database.Users.FirstOrDefault(u => u.UserToken == token);

          if (user != null)
          {
            user.Score += score;
            database.SaveChanges();
          }
          else
          {
            request.SetStatusCode(400);
          }

        }
        else if (request.Name == "getScore")
        {
          var token = request.GetParams<string?>();
          var userScore = database.Users.FirstOrDefault(s => s.UserToken == token)?.Score;

          if (userScore == null)
          {
            request.Respond<int?>(null);
          }
          else
          {
            request.Respond(userScore);
          }

        }
        else if (request.Name == "addCursorItem")
        {
          var (token, cursor) = request.GetParams<(string, int)>();
          var user = database.Users.FirstOrDefault(u => u.UserToken == token);

          if (user != null)
          {
            user.Cursor += cursor;
            database.SaveChanges();
          }
          else
          {
            request.SetStatusCode(400);
          }

        }
        else if (request.Name == "getCursorItem")
        {
          var token = request.GetParams<string>();
          var userCurser = database.Users.FirstOrDefault(s => s.UserToken == token)!.Cursor; 
          request.Respond(userCurser);

        }
      }
      catch (Exception exception)
      {
        request.SetStatusCode(500);
        Log.WriteException(exception);
      }
    }
  }
}

class Database() : DatabaseCore("database")
{
  public DbSet<User> Users { get; set; } = default!;

}

class User(string username, string password, string userToken)
{
  public int Id { get; set; } = default!;

  public string Username { get; set; } = username;

  [JsonIgnore] public string Password { get; set; } = password;

  [JsonIgnore] public string UserToken { get; set; } = userToken;

  public int Score { get; set; } = 0;
  public int Cursor { get; set; } = 0;
}

class Score(int points, int userId)
{
  public int Id { get; set; } = default!;
  public int Points { get; set; } = points;
  public int UserId { get; set; } = userId;
  public User User { get; set; } = default!;
}

class CursorItem(int cursors, int userId)
{
  public int Id { get; set; } = default!;
  public int Cursors { get; set; } = cursors;
  public int UserId { get; set; } = userId;
  public User User { get; set; } = default!;
}