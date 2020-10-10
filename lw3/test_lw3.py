from lw3 import Triangle


class TestTriangle:
    def test_check_the_triangle_is_correct_fill(self):
        t = Triangle(2, 3, 4)
        assert t.a == 2
        assert t.b == 3
        assert t.c == 4

    def test_check_the_triangle_is_correct_square(self):
        t = Triangle(5, 3, 4)
        assert t.getSquare() == 6

    def test_check_the_triangle_is_correct(self):
        t = Triangle(5, 3, 4)
        assert t.isCorrect()

    def test_check_the_triangle_is_not_correct(self):
        t = Triangle(55, 3, 4)
        assert not t.isCorrect()

    def test_check_the_triangle_is_not_correct2(self):
        t = Triangle(-5, 3, 4)
        assert not t.isCorrect()

    def test_check_correct_set_a(self):
        t = Triangle(5, 3, 4)
        t.setA(4)
        assert t.a == 4

    def test_check_correct_set_b(self):
        t = Triangle(5, 3, 4)
        t.setB(4)
        assert t.b == 4

    def test_check_correct_set_a(self):
        t = Triangle(5, 3, 4)
        t.setC(5)
        assert t.c == 5

    def test_check_the_triangle_is_equilateral(self):
        t = Triangle(5, 5, 5)
        assert t.isEquilateral()

    def test_check_the_triangle_is_not_equilateral(self):
        t = Triangle(3, 4, 5)
        assert not t.isEquilateral()

    def test_check_the_triangle_is_isosceles(self):
        t = Triangle(5, 6, 5)
        assert t.isIsosceles()

    def test_check_the_triangle_is_isosceles(self):
        t = Triangle(4, 6, 5)
        assert not t.isIsosceles()
