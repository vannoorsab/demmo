public class StudentRanking {
 public static String getRank(float score) {
 if (score >= 90) {
 return "Excellent";
 } else if (score >= 75) {
 return "Very Good";
 } else if (score >= 60) {
 return "Good";
 } else {
 return "Needs Improvement";
 }
 }
 
 public static void main(String[] args) {
 System.out.println(getRank(85)); 
 }
