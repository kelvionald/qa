using System;

namespace lw1
{
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length == 3)
            {
                try
                {
                    double a = Convert.ToDouble(args[0]);
                    double b = Convert.ToDouble(args[1]);
                    double c = Convert.ToDouble(args[2]);
                    if (a + b <= c || a + c <= b || b + c <= a || a < 0 || b < 0 || c < 0)
                    {
                        Console.WriteLine("не треугольник");
                    }
                    else if (a != b && a != c && b != c)
                    {
                        Console.WriteLine("обычный");
                    }
                    else if (a == b && b == c)
                    {
                        Console.WriteLine("равносторонний");
                    }
                    else
                    {
                        Console.WriteLine("равнобедренный");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("неизвестная ошибка");
                }
            }
            else
            {
                Console.WriteLine("неизвестная ошибка");
            }
        }
    }
}
