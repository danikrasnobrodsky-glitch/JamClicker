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

        else if (request.Name == "getUsername")
        {
          var token = request.GetParams<string>();

          var user = database.Users.FirstOrDefault(u => u.UserToken == token);

          if (user == null)
          {
            request.Respond<string?>(null);
          }
          else
          {
            request.Respond(user.Username);
          }
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

        else if (request.Name == "getPassword")
        {
            var token = request.GetParams<string>();

            var user = database.Users.FirstOrDefault(u => u.UserToken == token);

            if (user == null)
            {
                request.Respond<string?>(null);
            }
            else
            {
                request.Respond(user.Password);
            }
        }
        else if (request.Name == "getSelectLocation")
        {
            var token = request.GetParams<string>();

            var user = database.Users.FirstOrDefault(u => u.UserToken == token);

            if (user == null)
            {
                request.Respond<string?>(null);
            }
            else
            {
                request.Respond(user.SelectLocation);
            }
        }
        else if (request.Name == "addSelectLocation")
        {
          var (token, selectlocation) = request.GetParams<(string, string)>();
          var user = database.Users.FirstOrDefault(u => u.UserToken == token);

          if (user != null)
          {
            user.SelectLocation = selectlocation;
            database.SaveChanges();
          }
          else
          {
            request.SetStatusCode(400);
          }
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
          var token = request.GetParams<string>();
          var user = database.Users.FirstOrDefault(s => s.UserToken == token);

          if (user == null)
          {
            request.Respond<int?>(null);
          }
          else
          {
            request.Respond<int?>(user.Score);
          }
        }

        else if (request.Name == "getTopTen")
        {
            var topPlayers = database.Users.OrderByDescending(u => u.Score).Take(10).Select(u => new { u.Username, u.Score }).ToArray();
            request.Respond(topPlayers);
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

        else if (request.Name == "addGrandmaItem")
        {
          var (token, grandma) = request.GetParams<(string, int)>();
          var user = database.Users.FirstOrDefault(u => u.UserToken == token);

          if (user != null)
          {
            user.Grandma += grandma;

            database.SaveChanges();
          }
        }
        else if (request.Name == "getGrandmaItem")
        {
          var token = request.GetParams<string>();
          var userGranma = database.Users.FirstOrDefault(s => s.UserToken == token)!.Grandma;
          request.Respond(userGranma);
        }
        
        else if (request.Name == "addFarmItem")
        {
          var (token, farm) = request.GetParams<(string, int)>();
          var user = database.Users.FirstOrDefault(u => u.UserToken == token);

          if (user != null)
          {
            user.Farm += farm;

            database.SaveChanges();
          }
        }
        else if (request.Name == "getFarmItem")
        {
          var token = request.GetParams<string>();
          var userFarm = database.Users.FirstOrDefault(s => s.UserToken == token)!.Farm; 
          request.Respond(userFarm);
        }

        else if (request.Name == "addVillageItem")
        {
          var (token, village) = request.GetParams<(string, int)>();
          var user = database.Users.FirstOrDefault(u => u.UserToken == token);

          if (user != null)
          {
            user.Village += village;

            database.SaveChanges();
          }
        }
        else if (request.Name == "getVillageItem")
        {
          var token = request.GetParams<string>();
          var userVillage = database.Users.FirstOrDefault(s => s.UserToken == token)!.Village; 
          request.Respond(userVillage);
        }


        else if (request.Name == "addDoubleClick")
        {
          var token = request.GetParams<string>();
          var user = database.Users.FirstOrDefault(u => u.UserToken == token);

          if (user != null)
          {
            user.DoubleClick = true;

            database.SaveChanges();
            request.Respond(true);
          }
        }
        else if (request.Name == "getDoubleClick")
        {
          var token = request.GetParams<string>();
          var userDoubleClick = database.Users.FirstOrDefault(s => s.UserToken == token)!.DoubleClick;
          request.Respond(userDoubleClick);
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
  public int Grandma { get; set; } = 0;
  public int Farm { get; set; } = 0;
  public int Village { get; set; } = 0;

  public bool DoubleClick { get; set; } = false;

  public string SelectLocation { get; set; } = "----------";

  
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

class GradmaItem(int grandmas, int userId)
{
  public int Id { get; set; } = default!;
  public int Grandmas { get; set; } = grandmas;
  public int UserId { get; set; } = userId;
  public User User { get; set; } = default!;
}

class FarmItem(int farms, int userId)
{
  public int Id { get; set; } = default!;
  public int Farms { get; set; } = farms;
  public int UserId { get; set; } = userId;
  public User User { get; set; } = default!;
}

class VillageItem(int villages, int userId)
{
  public int Id { get; set; } = default!;
  public int Villages { get; set; } = villages;
  public int UserId { get; set; } = userId;
  public User User { get; set; } = default!;
}

class DoubleClickUpgrade(bool doubleclick, int userId)
{
  public int Id { get; set; } = default!;
  public bool DoubleClick { get; set; } = doubleclick;
  public int UserId { get; set; } = userId;
  public User User { get; set; } = default!;
}

class LocationSelector(string selectlocation, int userId)
{
  public int Id { get; set; } = default!;
  public string SelectLocation { get; set; } = selectlocation;
  public int UserId { get; set; } = userId;
  public User User { get; set; } = default!;
}