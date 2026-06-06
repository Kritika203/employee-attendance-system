class Employee {
  final String id;
  final String name;
  final String department;
  final String employeeCode;

  Employee({
    required this.id,
    required this.name,
    required this.department,
    required this.employeeCode,
  });

  factory Employee.fromJson(Map<String, dynamic> json) {
    return Employee(
      id: json['id'],
      name: json['name'],
      department: json['department'],
      employeeCode: json['employeeCode'],
    );
  }
}