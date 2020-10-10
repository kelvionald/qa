from math import sqrt


class Triangle:
    a = 0
    b = 0
    c = 0

    def __init__(self, a, b, c):
        self.a = a
        self.b = b
        self.c = c

    def getSquare(self):
        a, b, c = self.a, self.b, self.c
        p = 0.5 * (a + b + c)
        S = sqrt(p * (p - a) * (p - b) * (p - c))
        return S

    def getPerimeter(self):
        return self.a + self.b + self.c

    def isCorrect(self):
        a, b, c = self.a, self.b, self.c
        return 0 < c < a + b and a + c > b > 0 and b + c > a > 0

    def setA(self, a):
        self.a = a

    def setB(self, b):
        self.b = b

    def setC(self, c):
        self.c = c

    def isEquilateral(self):
        return self.a == self.b == self.c

    def isIsosceles(self):
        return self.a == self.b or self.b == self.c or self.a == self.c
