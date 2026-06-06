import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  Map<String, dynamic>? _employee;
  String? _todayStatus;
  bool _loading = false;
  bool _marking = false;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _loading = true);
    final employee = await ApiService.getEmployee();
    final today = DateTime.now().toIso8601String().split('T')[0];

    try {
      final history = await ApiService.getAttendanceHistory();
      final todayRecord = history.where((a) => a['date'] == today).toList();
      setState(() {
        _employee = employee;
        _todayStatus = todayRecord.isNotEmpty ? todayRecord.first['status'] : null;
      });
    } catch (e) {
      setState(() => _employee = employee);
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _markAttendance(String status) async {
    setState(() => _marking = true);
    try {
      await ApiService.markAttendance(status);
      setState(() => _todayStatus = status);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Marked as $status!'),
            backgroundColor: status == 'Present' ? const Color(0xFF10B981) : const Color(0xFFEF4444),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to mark attendance')),
        );
      }
    } finally {
      setState(() => _marking = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final today = DateTime.now();
    final dateStr = '${today.day}/${today.month}/${today.year}';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('Mark Attendance', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        foregroundColor: const Color(0xFF0F172A),
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF6366F1)))
          : Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6366F1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Hello, ${_employee?['name'] ?? ''}! 👋',
                            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 4),
                        Text(_employee?['department'] ?? '',
                            style: const TextStyle(color: Color(0xFFE0E7FF), fontSize: 14)),
                        const SizedBox(height: 12),
                        Text('Today: $dateStr',
                            style: const TextStyle(color: Color(0xFFE0E7FF), fontSize: 13)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text('Today\'s Status', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: _todayStatus == 'Present'
                                ? const Color(0xFFD1FAE5)
                                : _todayStatus == 'Absent'
                                    ? const Color(0xFFFEE2E2)
                                    : const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            _todayStatus ?? 'Not Marked',
                            style: TextStyle(
                              color: _todayStatus == 'Present'
                                  ? const Color(0xFF10B981)
                                  : _todayStatus == 'Absent'
                                      ? const Color(0xFFEF4444)
                                      : const Color(0xFFF59E0B),
                              fontWeight: FontWeight.w600,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  const Text('Mark Attendance', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _marking ? null : () => _markAttendance('Present'),
                          icon: const Icon(Icons.check),
                          label: const Text('Present'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF10B981),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _marking ? null : () => _markAttendance('Absent'),
                          icon: const Icon(Icons.close),
                          label: const Text('Absent'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFEF4444),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
    );
  }
}