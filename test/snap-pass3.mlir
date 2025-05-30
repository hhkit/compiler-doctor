module {
  func.func @test(%arg0: i32) -> i32 {
    %0 = llvm.add %arg0, %arg0 : i32
    %1 = llvm.add %0, %0 : i32
    return %1 : i32
  }
}
