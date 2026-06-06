import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

const String baseUrl = 'https://employee-attendance-system-backend-tnhv.onrender.com/api';

class ApiService {
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  static Future<void> saveEmployee(Map<String, dynamic> employee) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('employee', jsonEncode(employee));
  }

  static Future<Map<String, dynamic>?> getEmployee() async {
    final prefs = await SharedPreferences.getInstance();
    final data = prefs.getString('employee');
    if (data == null) return null;
    return jsonDecode(data);
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

 static Future<Map<String, dynamic>> employeeLogin(String employeeCode) async {
  try {
    final res = await http.post(
      Uri.parse('$baseUrl/auth/employee-login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'employeeCode': employeeCode}),
    );
    return jsonDecode(res.body);
  } catch (e) {
    rethrow;
  }
}
  static Future<Map<String, dynamic>> markAttendance(String status) async {
    final token = await getToken();
    final employee = await getEmployee();
    final today = DateTime.now().toIso8601String().split('T')[0];

    final res = await http.post(
      Uri.parse('$baseUrl/attendance'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'employeeId': employee!['id'],
        'date': today,
        'status': status,
      }),
    );
    return jsonDecode(res.body);
  }

  static Future<List<dynamic>> getAttendanceHistory() async {
    final token = await getToken();
    final employee = await getEmployee();

    final res = await http.get(
      Uri.parse('$baseUrl/attendance?employeeId=${employee!['id']}'),
      headers: {'Authorization': 'Bearer $token'},
    );
    return jsonDecode(res.body);
  }
}