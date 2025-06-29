describe 'RSpec Example' do
  it 'runs normally' do
    expect(true).to be true
  end

  it 'is skipped with skip: true', skip: true do
    expect(false).to be true
  end

  it 'is skipped with reason', skip: 'This test is skipped for a reason' do
    expect(false).to be true
  end

  it 'is pending' do
    pending 'This test is pending'
    expect(false).to be true
  end

  xit 'is excluded with xit' do
    expect(false).to be true
  end
end

xdescribe 'Excluded describe block' do
  it 'should not run' do
    expect(false).to be true
  end
end
