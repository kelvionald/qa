using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Reflection;
using System.Text.RegularExpressions;

namespace lw2
{
    class Program
    {
        static int validCount = 0;
        static int invalidCount = 0;

        static string rootLink = "http://91.210.252.240/broken-links/";

        static Dictionary<string, bool> visitedLinks = new Dictionary<string, bool>();

        static void FillLinks(List<string> links, List<string> currentLinks, string content)
        {
            string pattern = "<a.*href=\"([^#][^@]*?)\".*>";

            foreach (var link in Regex.Matches(content, pattern))
            {
                string url = Regex.Match(link.ToString(), pattern).Groups[1].Value;
                if (url.Substring(0, 7) == "http://" || url.Substring(0, 8) == "https://")
                {
                    Uri uri = new Uri(url);
                    string domain = uri.Authority;
                    if (domain != "91.210.252.240")
                    {
                        continue;
                    }
                }
                {
                    url = rootLink + url;
                }
                if (!visitedLinks.ContainsKey(url) && !links.Contains(url) && !currentLinks.Contains(url))
                {
                    links.Add(url);
                }
            }
        }

        static List<string> Serfing(List<string> links, StreamWriter validFile, StreamWriter invalidFile)
        {
            List<string> newLinks = new List<string>();
            foreach (string url in links)
            {
                visitedLinks.Add(url, true);
                try
                {
                    HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(url);
                    HttpWebResponse response = (HttpWebResponse)webRequest.GetResponse();
                    string content = "";
                    int status = (int)response.StatusCode;
                    validFile.WriteLine("{0} {1} {2}", url, status, response.StatusCode);
                    //Console.WriteLine("{0} {1} {2}", url, status, response.StatusCode);
                    using (Stream stream = response.GetResponseStream())
                    {
                        using (StreamReader reader = new StreamReader(stream))
                        {
                            content += reader.ReadToEnd();
                        }
                    }
                    response.Close();
                    FillLinks(newLinks, links, content);
                    validCount++;
                }
                catch (WebException e)
                {
                    HttpWebResponse response = (System.Net.HttpWebResponse)e.Response;
                    var statusCode = response.StatusCode;
                    invalidFile.WriteLine("{0} {1} {2}", url, (int)statusCode, response.StatusCode);
                    //Console.WriteLine("{0} {1} {2}", url, (int)statusCode, response.StatusCode);
                    invalidCount++;
                }
            }
            return newLinks;
        }

        static void Main(string[] args)
        {
            string startUrl = rootLink;
            List<string> links = new List<string>();
            links.Add(startUrl);
            using (StreamWriter validFile = new StreamWriter("valid.txt", false, System.Text.Encoding.Default))
            {
                using (StreamWriter invalidFile = new StreamWriter("invalid.txt", false, System.Text.Encoding.Default))
                {
                    while (links.Count != 0)
                    {
                        links = Serfing(links, validFile, invalidFile);
                    }
                    DateTime currentDate = DateTime.Now;
                    validFile.WriteLine("\nCount link: {0}", validCount);
                    validFile.WriteLine("Check date: {0}", currentDate);
                    invalidFile.WriteLine("\nCount link: {0}", invalidCount);
                    invalidFile.WriteLine("Check date: {0}", currentDate);
                }
            }
        }
    }
}
