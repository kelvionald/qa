using System;
using System.Diagnostics;
using System.IO;

namespace lw1.test
{
    class TestCase
    {
        public string command { get; set; }
        public string expect { get; set; }
    }

    class Program
    {
        static TestCase ReadTestCase(StreamReader sr)
        {
            TestCase testCase = new TestCase();
            testCase.command = sr.ReadLine();
            testCase.expect = sr.ReadLine();
            sr.ReadLine();
            return testCase;
        }

        static bool RunTestCase(TestCase testCase)
        {
            ProcessStartInfo procStartInfo = new ProcessStartInfo("cmd", "/c " + testCase.command);
            procStartInfo.RedirectStandardOutput = true;
            procStartInfo.UseShellExecute = false;
            procStartInfo.CreateNoWindow = true;
            Process proc = new Process();
            proc.StartInfo = procStartInfo;
            proc.Start();
            string result = proc.StandardOutput.ReadToEnd();

            return result.Trim() == testCase.expect;
        }

        static void Main(string[] args)
        {
            try
            {
                string path = args[0];
                int i = 1;

                using (StreamWriter sw = new StreamWriter("output.txt", false, System.Text.Encoding.Default))
                {
                    using (StreamReader sr = new StreamReader(path))
                    {
                        while (!sr.EndOfStream)
                        {
                            if (RunTestCase(ReadTestCase(sr)))
                            {
                                sw.WriteLine(i + " sucсess");
                            }
                            else
                            {
                                sw.WriteLine(i + " error");
                            }
                            i++;
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
        }
    }
}
