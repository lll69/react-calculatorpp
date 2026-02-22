package lll69.cpp;

// https://github.com/konsoletyper/teavm/issues/1092
public class WhileThrowTest {
    public static void main(String[] args) {
        while (true) {
            try {
                "".charAt(-1);
            } catch (IndexOutOfBoundsException e) {
                System.out.print("IndexOutOfBoundsException!");
                break;
            }
        }
        System.out.println("Finished!");
    }
}
